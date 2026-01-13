<?php

namespace App\Controllers;

use App\Models\UserModel;
use App\Models\PresetModel;
use CodeIgniter\RESTful\ResourceController;

class AdminController extends ResourceController
{
    /**
     * Get Dashboard Statistics
     */
    public function index()
    {
        $userModel = new UserModel();
        $presetModel = new PresetModel();

        return $this->respond([
            'status'  => 200,
            'message' => 'Admin dashboard stats retrieved',
            'data'    => [
                'stats' => [
                    'total_users'   => $userModel->countAllResults(),
                    'total_presets' => $presetModel->countAllResults(),
                    'active_users'  => $userModel->where('is_active', 1)->countAllResults(),
                ]
            ]
        ]);
    }

    /**
     * List all users
     */
    public function users()
    {
        $userModel = new UserModel();
        $users = $userModel->select('id, name, email, role, is_active, created_at')->findAll();

        return $this->respond([
            'status' => 200,
            'data'   => $users
        ]);
    }

    /**
     * Update a user's role or status
     */
    public function updateUser($id = null)
    {
        $userModel = new UserModel();
        $user = $userModel->find($id);

        if (!$user) {
            return $this->failNotFound('User not found');
        }

        $data = $this->request->getJSON(true) ?: $this->request->getRawInput();
        
        // Only allow updating specific fields via admin
        $allowedUpdate = array_intersect_key($data, array_flip(['role', 'is_active']));

        if (empty($allowedUpdate)) {
            return $this->fail('No valid fields provided for update');
        }

        if (!$userModel->update($id, $allowedUpdate)) {
            return $this->failValidationErrors($userModel->errors());
        }

        return $this->respond([
            'status'  => 200,
            'message' => 'User updated successfully'
        ]);
    }

    /**
     * Delete a user
     */
    public function deleteUser($id = null)
    {
        $userModel = new UserModel();
        if (!$userModel->find($id)) {
            return $this->failNotFound('User not found');
        }

        $userModel->delete($id);

        return $this->respondDeleted([
            'status'  => 200,
            'message' => 'User deleted successfully'
        ]);
    }
}
