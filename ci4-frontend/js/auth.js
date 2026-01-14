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

    // Base API URL
    const API_BASE = 'http://localhost/pixelFable-main/ci4-backend/public/index.php/api';

    // UI Utilities
    function showAlert(msg, type = 'error') {
        const alertBox = document.getElementById('auth-alert');
        if (!alertBox) return;

        alertBox.style.display = 'flex';
        alertBox.className = `alert alert-${type}`; // Assumes CSS has .alert-error and .alert-success
        alertBox.querySelector('.alert-msg').textContent = msg;
    }

    function hideAlert() {
        const alertBox = document.getElementById('auth-alert');
        if (alertBox) alertBox.style.display = 'none';
    }

    // --- Login Logic ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            hideAlert();

            const email = document.getElementById('email');
            const pass = document.getElementById('password');
            let isValid = true;

            // Validation
            clearErrors();
            if (!validateEmail(email.value)) {
                showError(email, 'Please enter a valid email address.');
                isValid = false;
            }
            if (pass.value.trim() === '') {
                showError(pass, 'Password is required.');
                isValid = false;
            }

            if (!isValid) return;

            // Submit
            const btn = loginForm.querySelector('.btn-auth');
            setLoading(btn, true);

            try {
                const response = await fetch(`${API_BASE}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: email.value,
                        password: pass.value
                    })
                });

                // Check content type before parsing
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    const htmlText = await response.text();
                    console.error('Backend returned non-JSON response for login:', htmlText);

                    const parser = new DOMParser();
                    const doc = parser.parseFromString(htmlText, 'text/html');
                    const errorMsg = doc.querySelector('h1')?.textContent ||
                        doc.querySelector('title')?.textContent ||
                        'Server Error (HTML returned)';

                    throw new Error(`Login failed: ${errorMsg}`);
                }

                const data = await response.json();

                if (!response.ok) {
                    const errorMsg = typeof data.messages === 'object'
                        ? Object.values(data.messages).join(', ')
                        : (data.message || data.error || 'Login failed');
                    throw new Error(errorMsg);
                }

                // Success
                if (data.token) {
                    localStorage.setItem('pf_token', data.token);
                    localStorage.setItem('pf_user', JSON.stringify(data.user));
                }

                // Redirect based on role
                if (data.user && (data.user.role === 'admin' || data.user.role === 'user_admin')) {
                    window.location.href = '../ci4-admin/index.html';
                } else {
                    window.location.href = 'index.html';
                }

            } catch (error) {
                console.error('Login Error details:', error);
                showAlert(error.message, 'error');
            } finally {
                setLoading(btn, false);
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

        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            hideAlert();

            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const terms = document.getElementById('terms');
            let isValid = true;

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

            if (!isValid) return;

            // Submit
            const btn = signupForm.querySelector('.btn-auth');
            setLoading(btn, true);

            try {
                const response = await fetch(`${API_BASE}/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: name.value,
                        email: email.value,
                        password: passwordInput.value,
                        role: 'customer' // Default role
                    })
                });

                // Check content type before parsing
                const contentType = response.headers.get('content-type');
                console.log('Response Content-Type:', contentType);
                console.log('Response Status:', response.status);

                // If response is HTML (error page), show it
                if (!contentType || !contentType.includes('application/json')) {
                    const htmlText = await response.text();
                    console.error('Backend returned HTML instead of JSON:');
                    console.error(htmlText);

                    // Try to extract error message from HTML
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(htmlText, 'text/html');
                    const errorMsg = doc.querySelector('h1')?.textContent ||
                        doc.querySelector('title')?.textContent ||
                        'Backend error - check console for details';

                    throw new Error(`Backend Error: ${errorMsg}\n\nThe backend returned an HTML error page. Check browser console (F12) for full details.`);
                }

                const data = await response.json();

                if (!response.ok) {
                    // Start of Selection
                    const errorMsg = typeof data.messages === 'object'
                        ? Object.values(data.messages).join(', ')
                        : (data.message || 'Registration failed');
                    throw new Error(errorMsg);
                }

                // Success
                showAlert('Account created successfully! Redirecting to login...', 'success');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);

            } catch (error) {
                console.error('Signup Error:', error);
                showAlert(error.message, 'error');
            } finally {
                setLoading(btn, false);
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

    function setLoading(btn, isLoading) {
        if (!btn) return;
        if (isLoading) {
            btn.classList.add('loading');
            btn.disabled = true;
        } else {
            btn.classList.remove('loading');
            btn.disabled = false;
        }
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
                    el.style.color = '#4ade80';
                } else {
                    el.classList.remove('valid');
                    el.style.color = '';
                }
            }
            if (!valid) allValid = false;
        }
        return allValid;
    }

    // Header Auth Check for Login/Signup pages
    function checkNavbarAuth() {
        const userStr = localStorage.getItem('pf_user');
        const navActions = document.querySelector('.nav-actions');
        const loginButtons = document.querySelectorAll('.login-btn');

        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user && (user.name || user.email)) {
                    const displayName = user.name ? user.name.split(' ')[0] : user.email.split('@')[0];

                    if (navActions) {
                        if (navActions.querySelector('.user-nav-info')) return;
                        loginButtons.forEach(btn => { if (navActions.contains(btn)) btn.remove(); });

                        const userContainer = document.createElement('div');
                        userContainer.className = 'user-nav-info';
                        userContainer.style.display = 'flex';
                        userContainer.style.alignItems = 'center';
                        userContainer.style.gap = '0.75rem';
                        userContainer.style.marginLeft = '1rem';

                        userContainer.innerHTML = `
                            <span class="user-name" style="color: white; font-weight: 600; font-size: 0.9rem;">Hi, ${displayName}</span>
                            <a href="#" class="logout-link" style="color: #ff4d4d; font-size: 0.8rem; text-decoration: none; padding: 0.4rem 0.8rem; border: 1px solid #ff4d4d; border-radius: 4px;">Logout</a>
                        `;

                        userContainer.querySelector('.logout-link').addEventListener('click', (e) => {
                            e.preventDefault();
                            localStorage.removeItem('pf_user');
                            localStorage.removeItem('pf_token');
                            window.location.reload();
                        });

                        navActions.appendChild(userContainer);
                    }
                }
            } catch (e) { }
        }
    }

    checkNavbarAuth();
});
