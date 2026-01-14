<?php

namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;
use Firebase\JWT\JWT;
use Exception;

class AuthController extends ResourceController
{
    use ResponseTrait;

    public function loginPage()
    {
        if (session()->get('isLoggedIn')) {
            return redirect()->to('/api/admin/dashboard');
        }
        return view('auth/login');
    }

    public function signupPage()
    {
        if (session()->get('isLoggedIn')) {
            return redirect()->to('/api/admin/dashboard');
        }
        return view('auth/signup');
    }

    public function signup()
    {
        $userModel = new UserModel();
        
        // Handle both JSON and Form Data
        $data = $this->request->getJSON(true) ?: $this->request->getPost();

        if (empty($data)) {
            return $this->fail('No data received');
        }

        if (!$userModel->insert($data)) {
            $errors = $userModel->errors();
            if ($this->isJSONRequest()) {
                return $this->failValidationErrors($errors);
            }
            return redirect()->back()->withInput()->with('errors', $errors);
        }

        if ($this->isJSONRequest()) {
            return $this->respondCreated([
                'status'  => 201,
                'message' => 'User registered successfully',
                'data'    => ['email' => $data['email']]
            ]);
        }

        return redirect()->to('/login')->with('success', 'Registration successful! Please login.');
    }

    public function login()
    {
        $rules = [
            'email'    => 'required|valid_email',
            'password' => 'required',
        ];

        if (!$this->validate($rules)) {
            if ($this->isJSONRequest()) {
                return $this->failValidationErrors($this->validator->getErrors());
            }
            return redirect()->back()->withInput()->with('errors', $this->validator->getErrors());
        }

        $userModel = new UserModel();
        
        // Try to get JSON first, fallback to standard post/get data
        $json = $this->request->getJSON(true) ?: [];
        $email    = $json['email'] ?? $this->request->getVar('email');
        $password = $json['password'] ?? $this->request->getVar('password');

        if (!$email || !$password) {
            return $this->fail('Email and password are required');
        }

        $user = $userModel->where('email', $email)->first();

        if (!$user || !password_verify($password, $user['password'])) {
            log_message('warning', 'Failed login attempt for email: {email}', ['email' => $email]);
            $error = 'Invalid login credentials';
            if ($this->isJSONRequest()) {
                return $this->failUnauthorized($error);
            }
            return redirect()->back()->withInput()->with('error', $error);
        }

        if ($user['is_active'] == 0) {
            log_message('warning', 'Login attempt for deactivated account: {email}', ['email' => $email]);
            $error = 'Your account is deactivated. Please contact support.';
            if ($this->isJSONRequest()) {
                return $this->failForbidden($error);
            }
            return redirect()->back()->withInput()->with('error', $error);
        }

        log_message('info', 'Successful login for user ID: {id}', ['id' => $user['id']]);

        // --- SESSION BASED AUTH ---
        $session = session();
        $sessionData = [
            'id'         => $user['id'],
            'email'      => $user['email'],
            'name'       => $user['name'] ?? '',
            'role'       => $user['role'],
            'isLoggedIn' => true,
        ];
        $session->set($sessionData);

        // --- JWT BASED AUTH (Optional/Keep for compatibility) ---
        $token = null;
        try {
            $key = getenv('JWT_SECRET') ?: 'pixel_fable_secret_key_change_me_123';
            $payload = [
                'iat'    => time(),
                'iss'    => base_url(),
                'exp'    => time() + (60 * 60 * 24 * 7), // 7 days
                'userId' => $user['id'],
                'role'   => $user['role'],
                'email'  => $user['email']
            ];

            $token = JWT::encode($payload, $key, 'HS256');
        } catch (Exception $e) {
            log_message('error', 'JWT Encoding Error: ' . $e->getMessage());
            // We can continue with session auth even if JWT fails for now
        }

        if ($this->isJSONRequest()) {
            return $this->respond([
                'status'  => 200,
                'message' => 'Login successful',
                'token'   => $token,
                'user'    => $sessionData
            ]);
        }

        return redirect()->to($user['role'] === 'admin' ? '/api/admin/dashboard' : '/');
    }

    public function logout()
    {
        session()->destroy();
        return $this->respond([
            'status'  => 200,
            'message' => 'Logout successful'
        ]);
    }

    public function profile()
    {
        return $this->respond([
            'status'  => 200,
            'message' => 'User profile retrieved',
            'user'    => session()->get()
        ]);
    }

    /**
     * Helper to detect if request expects or provides JSON
     */
    private function isJSONRequest()
    {
        return $this->request->isAJAX() || 
               str_contains($this->request->getHeaderLine('Accept'), 'application/json') ||
               str_contains($this->request->getHeaderLine('Content-Type'), 'application/json');
    }
}
