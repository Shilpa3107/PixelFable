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
        $userModel = new UserModel();
        $json = $this->request->getJSON(true);

        $email    = $json['email'] ?? null;
        $password = $json['password'] ?? null;

        if (!$email || !$password) {
            return $this->fail('Email and password are required');
        }

        $user = $userModel->where('email', $email)->first();

        if (!$user || !password_verify($password, $user['password'])) {
            return $this->failUnauthorized('Invalid login credentials');
        }

        $key = getenv('JWT_SECRET');
        $payload = [
            'iat'    => time(),
            'exp'    => time() + (60 * 60 * 24 * 7), // 7 days
            'userId' => $user['id'],
            'role'   => $user['role'],
            'email'  => $user['email']
        ];

        $token = JWT::encode($payload, $key, 'HS256');

        return $this->respond([
            'status'  => 200,
            'message' => 'Login successful',
            'token'   => $token,
            'user'    => [
                'id'    => $user['id'],
                'email' => $user['email'],
                'role'  => $user['role']
            ]
        ]);
    }
}
