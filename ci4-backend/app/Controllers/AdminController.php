<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class AdminController extends ResourceController
{
    public function index()
    {
        return $this->respond([
            'status'  => 200,
            'message' => 'Welcome to the Admin Dashboard',
            'data'    => [
                'stats' => [
                    'total_users' => 150,
                    'total_sales' => 5000
                ]
            ]
        ]);
    }
}
