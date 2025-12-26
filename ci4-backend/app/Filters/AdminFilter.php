<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class AdminFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $role = null;

        // 1. Check Session first
        if (session()->get('isLoggedIn')) {
            $role = session()->get('role');
        } 
        // 2. Check JWT if Session is not present
        else {
            $key = getenv('JWT_SECRET');
            $header = $request->getServer('HTTP_AUTHORIZATION');
            if ($header) {
                $token = explode(' ', $header)[1] ?? null;
                if ($token) {
                    try {
                        $decoded = JWT::decode($token, new Key($key, 'HS256'));
                        $role = $decoded->role ?? null;
                    } catch (Exception $e) {
                        // Token invalid/expired - will be caught by AuthFilter if applied
                    }
                }
            }
        }

        if ($role !== 'admin') {
            return service('response')->setJSON([
                'status'  => 403,
                'message' => 'Access denied. Administrator privileges required.'
            ])->setStatusCode(403);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        //
    }
}
