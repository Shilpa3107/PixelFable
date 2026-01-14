<?php

namespace App\Controllers;

use App\Controllers\BaseController;
use CodeIgniter\API\ResponseTrait;
use Razorpay\Api\Api;
use App\Models\PresetModel;
use App\Models\PurchaseModel;

class PaymentController extends BaseController
{
    use ResponseTrait;

    private $razorpayKey;
    private $razorpaySecret;

    public function __construct()
    {
        $this->razorpayKey = env('RAZORPAY_KEY_ID');
        $this->razorpaySecret = env('RAZORPAY_KEY_SECRET');
    }

    /**
     * Admin: List all orders
     */
    public function index()
    {
        // Security check via Route Filters generally, but explicit check doesn't hurt if filter fails
        // Actually rely on Filter: 'role:admin' on the route group.

        $purchaseModel = new PurchaseModel();
        
        // Join with presets to get product name
        // Purchases typical structure: id, preset_id, ...
        // Presets: id, name, ...
        
        $purchases = $purchaseModel->select('purchases.*, presets.name as preset_name')
                                   ->join('presets', 'presets.id = purchases.preset_id', 'left')
                                   ->orderBy('purchases.created_at', 'DESC')
                                   ->findAll();

        return $this->respond([
            'status' => 200,
            'data'   => $purchases
        ]);
    }

    /**
     * Step 1: Create a Razorpay Order
     */
    public function createOrder()
    {
        $presetId = $this->request->getVar('preset_id');
        // Handle both 'email' and 'customer_email' for flexibility
        $email = $this->request->getVar('email') ?? $this->request->getVar('customer_email');
        $name = $this->request->getVar('customer_name') ?? $this->request->getVar('name') ?? 'Guest';

        if (!$presetId || !$email) {
            return $this->fail('Preset ID and Email are required.');
        }

        $presetModel = new PresetModel();
        $preset = $presetModel->find($presetId);

        if (!$preset) {
            return $this->failNotFound('Preset not found.');
        }

        $api = new Api($this->razorpayKey, $this->razorpaySecret);

        try {
            // Amount MUST be an integer in paise (1 INR = 100 paise)
            $totalAmount = (int)round($preset['price'] * 100);

            $orderData = [
                'receipt'         => 'rcpt_' . time(),
                'amount'          => $totalAmount,
                'currency'        => 'INR',
                'payment_capture' => 1 // Auto capture
            ];

            $razorpayOrder = $api->order->create($orderData);

            // Store temporary record in purchases table
            $purchaseModel = new PurchaseModel();
            $purchaseModel->insert([
                'preset_id'         => $presetId,
                'customer_email'    => $email,
                'customer_name'     => $name,
                'price_paid'        => $preset['price'],
                'razorpay_order_id' => $razorpayOrder['id'],
                'status'            => 'pending',
                'transaction_id'    => $orderData['receipt']
            ]);

            return $this->respond([
                'status' => 200,
                'data' => [
                    'id' => $razorpayOrder['id'],
                    'amount' => $orderData['amount'],
                    'currency' => $orderData['currency'],
                    'key_id' => $this->razorpayKey
                ]
            ]);

        } catch (\Exception $e) {
            return $this->fail('Razorpay Order Creation Failed: ' . $e->getMessage());
        }
    }

    /**
     * Step 2: Verify Razorpay Payment Signature
     */
    public function verifyPayment()
    {
        $razorpayOrderId = $this->request->getVar('razorpay_order_id');
        $razorpayPaymentId = $this->request->getVar('razorpay_payment_id');
        $razorpaySignature = $this->request->getVar('razorpay_signature');

        if (!$razorpayOrderId || !$razorpayPaymentId || !$razorpaySignature) {
            return $this->fail('Incomplete payment details.');
        }

        $api = new Api($this->razorpayKey, $this->razorpaySecret);

        try {
            $attributes = [
                'razorpay_order_id' => $razorpayOrderId,
                'razorpay_payment_id' => $razorpayPaymentId,
                'razorpay_signature' => $razorpaySignature
            ];

            $api->utility->verifyPaymentSignature($attributes);

            // Update status in DB
            $purchaseModel = new PurchaseModel();
            $purchase = $purchaseModel->where('razorpay_order_id', $razorpayOrderId)->first();

            if (!$purchase) {
                return $this->failNotFound('Purchase record not found.');
            }

            if ($purchase['status'] === 'completed') {
                return $this->respond([
                    'status' => 200,
                    'message' => 'Payment already verified.',
                    'redirect_url' => base_url("api/payments/success/{$purchase['razorpay_payment_id']}")
                ]);
            }

            $purchaseModel->update($purchase['id'], [
                'razorpay_payment_id' => $razorpayPaymentId,
                'razorpay_signature'  => $razorpaySignature,
                'status'               => 'completed'
            ]);

            // TRIGGER: Send Email
            $this->sendPresetEmail($purchase['id']);

            return $this->respond([
                'status' => 200,
                'message' => 'Payment verified successfully.',
                'redirect_url' => base_url("api/payments/success/{$razorpayPaymentId}")
            ]);

        } catch (\Exception $e) {
            // Update status to failed
            $purchaseModel = new PurchaseModel();
            $purchaseModel->where('razorpay_order_id', $razorpayOrderId)
                          ->set(['status' => 'failed'])
                          ->update();

            return $this->fail('Payment Verification Failed: ' . $e->getMessage());
        }
    }

    /**
     * Step 2.5: Razorpay Webhook (Secondary Verification)
     */
    public function webhook()
    {
        $webhookSecret = env('RAZORPAY_WEBHOOK_SECRET');
        $signature = $this->request->header('X-Razorpay-Signature') ? $this->request->header('X-Razorpay-Signature')->getValue() : '';
        $postData = $this->request->getBody();

        if (!$signature) {
            return $this->fail('Signature missing', 400);
        }

        try {
            $api = new Api($this->razorpayKey, $this->razorpaySecret);
            $api->utility->verifyWebhookSignature($postData, $signature, $webhookSecret);

            $data = json_decode($postData, true);
            
            // Handle only 'order.paid' event
            if ($data['event'] === 'order.paid') {
                $orderId = $data['payload']['order']['entity']['id'];
                $paymentId = $data['payload']['payment']['entity']['id'];
                
                $purchaseModel = new PurchaseModel();
                $purchase = $purchaseModel->where('razorpay_order_id', $orderId)->first();

                if ($purchase && $purchase['status'] !== 'completed') {
                    $purchaseModel->update($purchase['id'], [
                        'razorpay_payment_id' => $paymentId,
                        'status' => 'completed'
                    ]);
                    
                    // TRIGGER: Send Email
                    $this->sendPresetEmail($purchase['id']);
                    
                    log_message('info', "Payment success via Webhook for Order: $orderId");
                }
            }

            return $this->respond(['status' => 'success']);

        } catch (\Exception $e) {
            log_message('error', "Webhook verification failed: " . $e->getMessage());
            return $this->fail('Webhook processing failed', 400);
        }
    }

    /**
     * Internal: Send Preset Download Email
     */
    private function sendPresetEmail($purchaseId)
    {
        $purchaseModel = new PurchaseModel();
        $purchase = $purchaseModel->find($purchaseId);
        
        if (!$purchase) return false;

        $presetModel = new PresetModel();
        $preset = $presetModel->find($purchase['preset_id']);

        if (!$preset) return false;

        $email = \Config\Services::email();

        $email->setTo($purchase['customer_email']);
        $email->setSubject("Your PixelFable Preset is Ready! - " . $preset['name']);

        // Premium HTML Template
        $htmlContent = "
        <div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);'>
            <div style='background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;'>
                <h1 style='margin: 0; font-size: 28px; letter-spacing: 1px;'>PixelFable</h1>
                <p style='margin: 5px 0 0; opacity: 0.9;'>Unlock Your Creative Potential</p>
            </div>
            <div style='padding: 30px; background: #fff;'>
                <h2 style='color: #2d3748; margin-top: 0;'>Thank you for your purchase, " . esc($purchase['customer_name']) . "!</h2>
                <p style='color: #4a5568; line-height: 1.6;'>Your order for the <strong>" . esc($preset['name']) . "</strong> preset has been successfully processed. You can now download your files using the secure link below.</p>
                
                <div style='margin: 35px 0; text-align: center;'>
                    <a href='" . esc($preset['drive_link']) . "' style='background: #764ba2; color: white; padding: 15px 35px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(118, 75, 162, 0.3);'>Download Preset Now</a>
                </div>

                <div style='background: #f7fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #764ba2; margin-top: 30px;'>
                    <h4 style='margin: 0 0 10px; color: #2d3748;'>Order Details:</h4>
                    <p style='margin: 2px 0; font-size: 14px; color: #718096;'><strong>Order ID:</strong> " . esc($purchase['razorpay_order_id']) . "</p>
                    <p style='margin: 2px 0; font-size: 14px; color: #718096;'><strong>Amount Paid:</strong> INR " . number_format($purchase['price_paid'], 2) . "</p>
                </div>

                <p style='color: #a0aec0; font-size: 12px; line-height: 1.5; margin-top: 40px; text-align: center;'>If you have any issues with your download, please reply to this email or contact support at pixelfable1825@gmail.com</p>
            </div>
            <div style='background: #fafafa; padding: 20px; text-align: center; border-top: 1px solid #eee;'>
                <p style='margin: 0; color: #718096; font-size: 14px;'>&copy; " . date('Y') . " PixelFable. All Rights Reserved.</p>
            </div>
        </div>
        ";

        $email->setMessage($htmlContent);

        if ($email->send()) {
            log_message('info', "Preset email sent to: " . $purchase['customer_email']);
            return true;
        } else {
            log_message('error', "Email failed to send: " . $email->printDebugger(['headers']));
            return false;
        }
    }

    /**
     * Step 3: Success Landing Page
     */
    public function success($paymentId = null)
    {
        $purchaseModel = new PurchaseModel();
        $purchase = $purchaseModel->where('razorpay_payment_id', $paymentId)->first();

        if (!$purchase) {
            return redirect()->to('/')->with('error', 'Purchase record not found.');
        }

        $presetModel = new PresetModel();
        $preset = $presetModel->find($purchase['preset_id']);

        return view('payment/success', [
            'purchase' => $purchase,
            'preset'   => $preset
        ]);
    }

    /**
     * TEST: Verify Email Configuration
     */
    public function testEmail()
    {
        $email = \Config\Services::email();
        $to = $this->request->getVar('to') ?? 'your-test-email@gmail.com';

        $email->setTo($to);
        $email->setSubject("PixelFable Email Test");
        $email->setMessage("<h1>It Works!</h1><p>This is a test email from your PixelFable backend. Your SMTP settings are correctly configured.</p>");

        if ($email->send()) {
            return $this->respond(['status' => 200, 'message' => "Test email sent successfully to $to"]);
        } else {
            return $this->fail("Email failed: " . $email->printDebugger(['headers']));
        }
    }
}
