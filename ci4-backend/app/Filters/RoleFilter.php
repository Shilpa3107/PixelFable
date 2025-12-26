<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class RoleFilter implements FilterInterface
{
    /**
     * @param array|null $arguments The roles allowed to access the route
     */
    public function before(RequestInterface $request, $arguments = null)
    {
        if (empty($arguments)) {
            return;
        }

        $userRole = null;

        // 1. Check Session
        if (session()->get('isLoggedIn')) {
            $userRole = session()->get('role');
        } 
        // 2. Check JWT
        else {
            $key = getenv('JWT_SECRET');
            $header = $request->getServer('HTTP_AUTHORIZATION');
            if ($header) {
                $token = explode(' ', $header)[1] ?? null;
                if ($token) {
                    try {
                        $decoded = JWT::decode($token, new Key($key, 'HS256'));
                        $userRole = $decoded->role ?? null;
                    } catch (Exception $e) {
                        // handled by auth filter
                    }
                }
            }
        }

        if (!$userRole || !in_array($userRole, $arguments)) {
            return service('response')->setJSON([
                'status'  => 403,
                'message' => 'Forbidden. You do not have the required role (' . implode(', ', $arguments) . ') to access this resource.'
            ])->setStatusCode(403);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        //
    }
}
