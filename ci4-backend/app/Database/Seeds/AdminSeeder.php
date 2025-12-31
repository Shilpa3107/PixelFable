<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run()
    {
        $data = [
            'email'     => 'admin@pixelfable.com',
            'password'  => password_hash('Admin@123', PASSWORD_DEFAULT),
            'role'      => 'admin',
            'is_active' => 1,
        ];

        // Using Query Builder
        $this->db->table('users')->insert($data);
        
        echo "Admin user created: admin@pixelfable.com / Admin@123\n";
    }
}
