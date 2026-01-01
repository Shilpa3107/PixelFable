<?php

namespace App\Commands;

use CodeIgniter\CLI\BaseCommand;
use CodeIgniter\CLI\CLI;

class FixPurchasesTable extends BaseCommand
{
    protected $group       = 'Database';
    protected $name        = 'db:fix-purchases';
    protected $description = 'Manually adds Razorpay columns to purchases table';

    public function run(array $params)
    {
        $db = \Config\Database::connect();
        $forge = \Config\Database::forge();

        $fields = [
            'razorpay_order_id' => [
                'type'       => 'VARCHAR',
                'constraint' => '100',
                'null'       => true,
                'after'      => 'transaction_id'
            ],
            'razorpay_payment_id' => [
                'type'       => 'VARCHAR',
                'constraint' => '100',
                'null'       => true,
                'after'      => 'razorpay_order_id'
            ],
            'razorpay_signature' => [
                'type'       => 'VARCHAR',
                'constraint' => '255',
                'null'       => true,
                'after'      => 'razorpay_payment_id'
            ],
        ];

        try {
            $forge->addColumn('purchases', $fields);
            CLI::write('Columns added successfully!', 'green');
        } catch (\Exception $e) {
            CLI::error('Error adding columns: ' . $e->getMessage());
        }
    }
}
