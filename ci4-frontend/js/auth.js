/**
 * PixelFable Frontend Auth Validation
 */

document.addEventListener('DOMContentLoaded', () => {
    // Select forms
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    // Input references
    const passwordInput = document.getElementById('password');
    const confirmPassInput = document.getElementById('confirm-password');

    // --- Login Logic ---
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            let isValid = true;
            const email = document.getElementById('email');
            const pass = document.getElementById('password');

            // Reset errors
            clearErrors();

            if (!validateEmail(email.value)) {
                showError(email, 'Please enter a valid email address.');
                isValid = false;
            }

            if (pass.value.trim() === '') {
                showError(pass, 'Password is required.');
                isValid = false;
            }

            if (!isValid) {
                e.preventDefault();
            } else {
                setLoading(loginForm.querySelector('.btn-auth'));
            }
        });
    }

    // --- Signup Logic ---
    if (signupForm) {
        // Real-time Password Strength
        if (passwordInput) {
            passwordInput.addEventListener('input', function () {
                validatePasswordStrength(this.value);
            });
        }

        signupForm.addEventListener('submit', (e) => {
            let isValid = true;
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const terms = document.getElementById('terms');

            clearErrors();

            if (name.value.trim().length < 2) {
                showError(name, 'Name must be at least 2 characters.');
                isValid = false;
            }

            if (!validateEmail(email.value)) {
                showError(email, 'Please enter a valid email address.');
                isValid = false;
            }

            if (!validatePasswordStrength(passwordInput.value)) {
                showError(passwordInput, 'Password must meet complexity requirements.');
                isValid = false;
            }

            if (passwordInput.value !== confirmPassInput.value) {
                showError(confirmPassInput, 'Passwords do not match.');
                isValid = false;
            }

            if (terms && !terms.checked) {
                // Custom error for checkbox? Or standard browser validation
                // Assuming standard required attribute handles it, but just in case
            }

            if (!isValid) {
                e.preventDefault();
            } else {
                setLoading(signupForm.querySelector('.btn-auth'));
            }
        });
    }

    // Utilities
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showError(input, message) {
        input.classList.add('error');
        const errorMsg = input.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains('input-error-msg')) {
            errorMsg.textContent = message;
        }
    }

    function clearErrors() {
        document.querySelectorAll('.form-control.error').forEach(el => el.classList.remove('error'));
    }

    function setLoading(btn) {
        if (!btn) return;
        btn.classList.add('loading');
        const span = btn.querySelector('span');
        if (span) span.textContent = btn.dataset.loadingText || 'Processing...';
        btn.disabled = true;
    }

    function validatePasswordStrength(val) {
        const checks = {
            length: val.length >= 8,
            upper: /[A-Z]/.test(val),
            number: /[0-9]/.test(val),
            special: /[@$!%*?&]/.test(val)
        };

        let allValid = true;
        for (const [key, valid] of Object.entries(checks)) {
            const el = document.getElementById(`req-${key}`);
            if (el) {
                if (valid) {
                    el.classList.add('valid');
                    el.querySelector('svg').style.color = '#4ade80';
                } else {
                    el.classList.remove('valid');
                    el.querySelector('svg').style.color = '';
                }
            }
            if (!valid) allValid = false;
        }
        return allValid;
    }
});
