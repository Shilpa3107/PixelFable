<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up | PixelFable</title>
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <!-- Custom CSS -->
    <link rel="stylesheet" href="<?= base_url('css/auth.css') ?>">
    <style>
        .password-requirements {
            font-size: 0.75rem;
            color: var(--color-text-muted);
            margin-top: 8px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4px;
        }
        .requirement {
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .requirement.valid {
            color: var(--color-success);
        }
        .requirement.valid i {
            color: var(--color-success);
        }
    </style>
</head>
<body>
    <div class="auth-bg"></div>

    <div class="auth-container" style="max-width: 480px;">
        <div class="auth-card">
            <div class="auth-header">
                <div class="auth-logo">
                    <i data-lucide="zap" style="color: var(--color-primary); width: 32px; height: 32px; fill: var(--color-primary);"></i>
                    <h1 class="logo-text">Pixel<span>Fable</span></h1>
                </div>
                <h2 class="auth-title">Create Account</h2>
                <p class="auth-subtitle">Join us to start your creative journey.</p>
            </div>

            <?php if (session()->getFlashdata('errors')): ?>
                <div class="alert alert-danger" style="display: block;">
                    <ul style="list-style: none; padding: 0;">
                        <?php foreach (session()->getFlashdata('errors') as $error): ?>
                            <li style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                                <i data-lucide="alert-circle" style="width: 14px; height: 14px;"></i>
                                <?= $error ?>
                            </li>
                        <?php window.lucide.createIcons(); ?>
                        <?php endforeach; ?>
                    </ul>
                </div>
            <?php endif; ?>

            <form id="signupForm" action="<?= base_url('api/signup') ?>" method="POST">
                <?= csrf_field() ?>
                
                <div class="form-group">
                    <label class="form-label" for="name">Full Name</label>
                    <div class="input-wrapper">
                        <i data-lucide="user" class="input-icon"></i>
                        <input type="text" id="name" name="name" class="form-control" placeholder="John Doe" required value="<?= old('name') ?>">
                    </div>
                    <div class="error-message" id="nameError">Name must be at least 2 characters.</div>
                </div>

                <div class="form-group">
                    <label class="form-label" for="email">Email Address</label>
                    <div class="input-wrapper">
                        <i data-lucide="mail" class="input-icon"></i>
                        <input type="email" id="email" name="email" class="form-control" placeholder="john@example.com" required value="<?= old('email') ?>">
                    </div>
                    <div class="error-message" id="emailError">Please enter a valid email address.</div>
                </div>

                <div class="form-group">
                    <label class="form-label" for="password">Password</label>
                    <div class="input-wrapper">
                        <i data-lucide="lock" class="input-icon"></i>
                        <input type="password" id="password" name="password" class="form-control" placeholder="••••••••" required>
                    </div>
                    <div class="password-requirements">
                        <div class="requirement" id="req-length"><i data-lucide="circle" style="width: 10px;"></i> 8+ chars</div>
                        <div class="requirement" id="req-upper"><i data-lucide="circle" style="width: 10px;"></i> 1 Uppercase</div>
                        <div class="requirement" id="req-number"><i data-lucide="circle" style="width: 10px;"></i> 1 Number</div>
                        <div class="requirement" id="req-special"><i data-lucide="circle" style="width: 10px;"></i> 1 Special</div>
                    </div>
                    <div class="error-message" id="passwordError">Password does not meet requirements.</div>
                </div>

                <div class="form-group">
                    <label class="form-label" for="confirm_password">Confirm Password</label>
                    <div class="input-wrapper">
                        <i data-lucide="shield-check" class="input-icon"></i>
                        <input type="password" id="confirm_password" name="confirm_password" class="form-control" placeholder="••••••••" required>
                    </div>
                    <div class="error-message" id="confirmPasswordError">Passwords do not match.</div>
                </div>

                <div class="form-group" style="margin-bottom: 24px;">
                    <label class="remember-me" style="font-size: 0.8125rem;">
                        <input type="checkbox" name="terms" required>
                        <span>I agree to the <a href="#" style="color: var(--color-primary);">Terms of Service</a> and <a href="#" style="color: var(--color-primary);">Privacy Policy</a>.</span>
                    </label>
                </div>

                <button type="submit" class="btn-auth" id="signupBtn">
                    <span>Create Account</span>
                    <i data-lucide="user-plus" style="width: 18px; height: 18px;"></i>
                </button>
            </form>

            <div class="auth-footer">
                Already have an account? <a href="<?= base_url('login') ?>">Log in</a>
            </div>
        </div>
    </div>

    <script>
        // Initialize Icons
        lucide.createIcons();

        const signupForm = document.getElementById('signupForm');
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmInput = document.getElementById('confirm_password');
        const signupBtn = document.getElementById('signupBtn');

        // Live Password Validation
        passwordInput.addEventListener('input', function() {
            const val = this.value;
            const checks = {
                length: val.length >= 8,
                upper: /[A-Z]/.test(val),
                number: /[0-9]/.test(val),
                special: /[@$!%*?&]/.test(val)
            };

            for (const [req, isValid] of Object.entries(checks)) {
                const el = document.getElementById('req-' + req);
                if (isValid) {
                    el.classList.add('valid');
                    el.querySelector('i').setAttribute('data-lucide', 'check-circle');
                } else {
                    el.classList.remove('valid');
                    el.querySelector('i').setAttribute('data-lucide', 'circle');
                }
            }
            lucide.createIcons();
        });

        signupForm.addEventListener('submit', function(e) {
            let isValid = true;

            // Name validation
            if (nameInput.value.trim().length < 2) {
                showError('name');
                isValid = false;
            } else {
                hideError('name');
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                showError('email');
                isValid = false;
            } else {
                hideError('email');
            }

            // Password validation
            const passVal = passwordInput.value;
            const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passRegex.test(passVal)) {
                showError('password');
                isValid = false;
            } else {
                hideError('password');
            }

            // Confirm password
            if (confirmInput.value !== passVal) {
                showError('confirmPassword');
                isValid = false;
            } else {
                hideError('confirmPassword');
            }

            if (!isValid) {
                e.preventDefault();
            } else {
                signupBtn.innerHTML = '<span>Creating Account...</span>';
                signupBtn.style.opacity = '0.7';
                signupBtn.disabled = true;
            }
        });

        function showError(field) {
            const input = document.getElementById(field === 'confirmPassword' ? 'confirm_password' : field);
            const error = document.getElementById(field + 'Error');
            input.classList.add('error');
            error.style.display = 'block';
        }

        function hideError(field) {
            const input = document.getElementById(field === 'confirmPassword' ? 'confirm_password' : field);
            const error = document.getElementById(field + 'Error');
            input.classList.remove('error');
            error.style.display = 'none';
        }
    </script>
</body>
</html>
