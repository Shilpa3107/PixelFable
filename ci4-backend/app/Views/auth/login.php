<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login | PixelFable</title>
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <!-- Custom CSS -->
    <link rel="stylesheet" href="<?= base_url('css/auth.css') ?>">
</head>
<body>
    <div class="auth-bg"></div>

    <div class="auth-container">
        <div class="auth-card">
            <div class="auth-header">
                <div class="auth-logo">
                    <i data-lucide="zap" style="color: var(--color-primary); width: 32px; height: 32px; fill: var(--color-primary);"></i>
                    <h1 class="logo-text">Pixel<span>Fable</span></h1>
                </div>
                <h2 class="auth-title">Welcome Back</h2>
                <p class="auth-subtitle">Log in to manage your presets and orders.</p>
            </div>

            <?php if (session()->getFlashdata('error')): ?>
                <div class="alert alert-danger">
                    <i data-lucide="alert-circle" style="width: 18px; height: 18px;"></i>
                    <?= session()->getFlashdata('error') ?>
                </div>
            <?php endif; ?>

            <?php if (session()->getFlashdata('success')): ?>
                <div class="alert alert-success">
                    <i data-lucide="check-circle" style="width: 18px; height: 18px;"></i>
                    <?= session()->getFlashdata('success') ?>
                </div>
            <?php endif; ?>

            <form id="loginForm" action="<?= base_url('api/login') ?>" method="POST">
                <?= csrf_field() ?>
                
                <div class="form-group">
                    <label class="form-label" for="email">Email Address</label>
                    <div class="input-wrapper">
                        <i data-lucide="mail" class="input-icon"></i>
                        <input type="email" id="email" name="email" class="form-control" placeholder="admin@pixelfable.com" required value="<?= old('email') ?>">
                    </div>
                    <div class="error-message" id="emailError">Please enter a valid email address.</div>
                </div>

                <div class="form-group">
                    <label class="form-label" for="password">Password</label>
                    <div class="input-wrapper">
                        <i data-lucide="lock" class="input-icon"></i>
                        <input type="password" id="password" name="password" class="form-control" placeholder="••••••••" required>
                    </div>
                    <div class="error-message" id="passwordError">Password is required.</div>
                </div>

                <div class="auth-options">
                    <label class="remember-me">
                        <input type="checkbox" name="remember">
                        <span>Remember me</span>
                    </label>
                    <a href="#" class="forgot-password">Forgot password?</a>
                </div>

                <button type="submit" class="btn-auth" id="loginBtn">
                    <span>Log In</span>
                    <i data-lucide="arrow-right" style="width: 18px; height: 18px;"></i>
                </button>
            </form>

            <div class="auth-footer">
                Don't have an account? <a href="<?= base_url('signup') ?>">Sign up</a>
            </div>
        </div>
    </div>

    <script>
        // Initialize Icons
        lucide.createIcons();

        // Client-side Validation
        const loginForm = document.getElementById('loginForm');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const loginBtn = document.getElementById('loginBtn');

        loginForm.addEventListener('submit', function(e) {
            let isValid = true;

            // Email validation
            const emailValue = emailInput.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailValue)) {
                showError('email');
                isValid = false;
            } else {
                hideError('email');
            }

            // Password validation
            if (passwordInput.value.length === 0) {
                showError('password');
                isValid = false;
            } else {
                hideError('password');
            }

            if (!isValid) {
                e.preventDefault();
            } else {
                loginBtn.innerHTML = '<span>Verifying...</span>';
                loginBtn.style.opacity = '0.7';
                loginBtn.disabled = true;
            }
        });

        function showError(field) {
            const input = document.getElementById(field);
            const error = document.getElementById(field + 'Error');
            input.classList.add('error');
            error.style.display = 'block';
        }

        function hideError(field) {
            const input = document.getElementById(field);
            const error = document.getElementById(field + 'Error');
            input.classList.remove('error');
            error.style.display = 'none';
        }

        // Live validation on blur
        emailInput.addEventListener('blur', () => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput.value.trim() !== "" && !emailRegex.test(emailInput.value.trim())) {
                showError('email');
            } else {
                hideError('email');
            }
        });

        passwordInput.addEventListener('blur', () => {
            if (passwordInput.value.length > 0) {
                hideError('password');
            }
        });
    </script>
</body>
</html>
