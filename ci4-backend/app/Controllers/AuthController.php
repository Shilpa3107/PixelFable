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

    public function signup()
    {
        $userModel = new UserModel();
        $data = $this->request->getJSON(true);

        if (!$userModel->insert($data)) {
            return $this->failValidationErrors($userModel->errors());
        }

        return $this->respondCreated([
            'status'  => 201,
            'message' => 'User registered successfully',
            'data'    => [
                'email' => $data['email']
            ]
        ]);
    }

    public function login()
    {
        $rules = [
            'email'    => 'required|valid_email',
            'password' => 'required',
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $userModel = new UserModel();
        
        // Try to get JSON first, fallback to standard post/get data
        $json = $this->request->getJSON(true);
        $email    = $json['email'] ?? $this->request->getVar('email');
        $password = $json['password'] ?? $this->request->getVar('password');

        if (!$email || !$password) {
            return $this->fail('Email and password are required');
        }

        $user = $userModel->where('email', $email)->first();

        if (!$user || !password_verify($password, $user['password'])) {
            log_message('warning', 'Failed login attempt for email: {email}', ['email' => $email]);
            return $this->failUnauthorized('Invalid login credentials');
        }

        if ($user['is_active'] == 0) {
            log_message('warning', 'Login attempt for deactivated account: {email}', ['email' => $email]);
            return $this->failForbidden('Your account is deactivated. Please contact support.');
        }

        log_message('info', 'Successful login for user ID: {id}', ['id' => $user['id']]);

        // --- SESSION BASED AUTH ---
        $session = session();
        $sessionData = [
            'id'       => $user['id'],
            'email'    => $user['email'],
            'role'     => $user['role'],
            'isLoggedIn' => true,
        ];
        $session->set($sessionData);

        // --- JWT BASED AUTH (Optional/Keep for compatibility) ---
        $key = getenv('JWT_SECRET');
        $payload = [
            'iat'    => time(),
            'iss'    => base_url(),
            'exp'    => time() + (60 * 60 * 24 * 7), // 7 days
            'userId' => $user['id'],
            'role'   => $user['role'],
            'email'  => $user['email']
        ];

        $token = JWT::encode($payload, $key, 'HS256');

        return $this->respond([
            'status'  => 200,
            'message' => 'Login successful',
            'token'   => $token, // JWT still returned if needed
            'user'    => $sessionData
        ]);
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
}
