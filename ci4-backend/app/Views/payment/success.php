<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Successful | PixelFable</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #6366f1;
            --secondary: #a855f7;
            --bg: #0f172a;
            --card-bg: #1e293b;
            --text-main: #f8fafc;
            --text-dim: #94a3b8;
            --success: #22c55e;
        }

        body {
            margin: 0;
            padding: 0;
            font-family: 'Outfit', sans-serif;
            background-color: var(--bg);
            color: var(--text-main);
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            overflow: hidden;
        }

        /* Animated Background Gradients */
        .bg-glow {
            position: fixed;
            top: 50%;
            left: 50%;
            width: 800px;
            height: 800px;
            background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0) 70%);
            transform: translate(-50%, -50%);
            z-index: -1;
            filter: blur(100px);
            animation: pulse 10s infinite alternate;
        }

        @keyframes pulse {
            0% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
            100% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
        }

        .success-card {
            background: var(--card-bg);
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 3rem;
            border-radius: 24px;
            text-align: center;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(10px);
            animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUp {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        .icon-box {
            width: 80px;
            height: 80px;
            background: rgba(34, 197, 94, 0.1);
            border: 2px solid var(--success);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 2rem;
            color: var(--success);
            animation: scaleIn 0.5s 0.3s both cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes scaleIn {
            from { transform: scale(0); }
            to { transform: scale(1); }
        }

        h1 {
            font-size: 2rem;
            margin-bottom: 0.5rem;
            background: linear-gradient(to right, #fff, #94a3b8);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        p {
            color: var(--text-dim);
            line-height: 1.6;
            margin-bottom: 2rem;
        }

        .order-details {
            background: rgba(15, 23, 42, 0.5);
            border-radius: 16px;
            padding: 1.5rem;
            margin-bottom: 2rem;
            text-align: left;
            border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.75rem;
            font-size: 0.9rem;
        }

        .detail-row:last-child { margin-bottom: 0; }

        .label { color: var(--text-dim); }
        .value { color: var(--text-main); font-weight: 600; }

        .btn {
            display: inline-block;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            text-decoration: none;
            padding: 1rem 2rem;
            border-radius: 12px;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
            width: 100%;
            box-sizing: border-box;
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
            filter: brightness(1.1);
        }

        .btn-outline {
            background: transparent;
            border: 1px solid rgba(255, 255, 255, 0.1);
            margin-top: 1rem;
            box-shadow: none;
        }

        .btn-outline:hover {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(255, 255, 255, 0.2);
        }
    </style>
</head>
<body>
    <div class="bg-glow"></div>

    <div class="success-card">
        <div class="icon-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>

        <h1>Payment Successful!</h1>
        <p>Your order has been confirmed. You will receive an email with your download instructions shortly.</p>

        <div class="order-details">
            <div class="detail-row">
                <span class="label">Product</span>
                <span class="value"><?= esc($preset['name']) ?></span>
            </div>
            <div class="detail-row">
                <span class="label">Amount Paid</span>
                <span class="value">₹<?= esc($purchase['price_paid']) ?></span>
            </div>
            <div class="detail-row">
                <span class="label">Payment ID</span>
                <span class="value" style="font-family: monospace; font-size: 0.8rem;"><?= esc($purchase['razorpay_payment_id']) ?></span>
            </div>
        </div>

        <a href="<?= base_url('api/presets') ?>" class="btn">Explore More Presets</a>
        <a href="<?= base_url('/') ?>" class="btn btn-outline">Back to Home</a>
    </div>

    <!-- Micro-interaction for the checkmark -->
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            console.log("PixelFable: Payment Success Page Loaded.");
        });
    </script>
</body>
</html>
