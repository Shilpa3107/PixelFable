<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreatePurchases extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'preset_id' => ['type' => 'INT', 'unsigned' => true],
            'transaction_id' => ['type' => 'VARCHAR', 'constraint' => '100'],
            'customer_email' => ['type' => 'VARCHAR', 'constraint' => '150'],
            'customer_name'  => ['type' => 'VARCHAR', 'constraint' => '150', 'default' => 'Guest'],
            'price_paid'     => ['type' => 'DECIMAL', 'constraint' => '10,2'],
            'status' => [
                'type'       => 'ENUM',
                'constraint' => ['pending', 'completed', 'failed', 'refunded'],
                'default'    => 'completed',
            ],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addKey('transaction_id'); // Added index for fast lookups
        $this->forge->addForeignKey('preset_id', 'presets', 'id', 'RESTRICT', 'CASCADE');
        $this->forge->createTable('purchases');
    }

    public function down()
    {
        $this->forge->dropTable('purchases');
    }
}