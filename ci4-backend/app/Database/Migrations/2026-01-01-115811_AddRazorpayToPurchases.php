<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class AddRazorpayToPurchases extends Migration
{
    public function up()
    {
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
        $this->forge->addColumn('purchases', $fields);

        // Update status enum constraint if needed (already has pending, completed, failed)
    }

    public function down()
    {
        $this->forge->dropColumn('purchases', ['razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature']);
    }
}
