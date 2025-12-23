<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class AuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $key = getenv('JWT_SECRET');
        $header = $request->getServer('HTTP_AUTHORIZATION');

        if (!$header) {
            return service('response')->setJSON([
                'status'  => 401,
                'message' => 'Authorization header missing'
            ])->setStatusCode(401);
        }

        $token = explode(' ', $header)[1] ?? null;

        if (!$token) {
            return service('response')->setJSON([
                'status'  => 401,
                'message' => 'Token not found'
            ])->setStatusCode(401);
        }

        try {
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
            // Optionally, you can attach user data to the request
            // $request->user = $decoded;
        } catch (Exception $e) {
            return service('response')->setJSON([
                'status'  => 401,
                'message' => 'Invalid or expired token'
            ])->setStatusCode(401);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // Do something here
    }
}
