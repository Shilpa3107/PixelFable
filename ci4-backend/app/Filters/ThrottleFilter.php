<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Config\Services;

class ThrottleFilter implements FilterInterface
{
    /**
     * This filter will throttle requests based on IP address.
     * Default: 10 requests per minute for the specific route.
     */
    public function before(RequestInterface $request, $arguments = null)
    {
        $throttler = Services::throttler();

        // 10 requests per minute
        // Arguments can override the rate: [capacity, seconds]
        $capacity = $arguments[0] ?? 10;
        $seconds  = $arguments[1] ?? 60;

        // Use IP address + path as the key
        $key = 'throttle_' . md5($request->getIPAddress() . $request->getUri()->getPath());

        if ($throttler->check($key, $capacity, $seconds) === false) {
            return Services::response()->setJSON([
                'status'  => 429,
                'message' => 'Too many requests. Please try again in ' . $throttler->getTokentime() . ' seconds.',
            ])->setStatusCode(429);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        //
    }
}
