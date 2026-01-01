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
     * Step 1: Create a Razorpay Order
     */
    public function createOrder()
    {
        $presetId = $this->request->getVar('preset_id');
        $email = $this->request->getVar('email');
        $name = $this->request->getVar('name') ?? 'Guest';

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
            // Amount is in paisa (1 INR = 100 paisa)
            $orderData = [
                'receipt'         => 'rcpt_' . time(),
                'amount'          => $preset['price'] * 100,
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
                'order_id' => $razorpayOrder['id'],
                'amount' => $orderData['amount'],
                'currency' => $orderData['currency'],
                'key' => $this->razorpayKey
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

            $purchaseModel->update($purchase['id'], [
                'razorpay_payment_id' => $razorpayPaymentId,
                'razorpay_signature'  => $razorpaySignature,
                'status'               => 'completed'
            ]);

            return $this->respond([
                'status' => 200,
                'message' => 'Payment verified successfully.'
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
}
