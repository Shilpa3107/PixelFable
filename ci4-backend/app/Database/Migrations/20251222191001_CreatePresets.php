<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreatePresets extends Migration
{
    public function up()
    {
        // 1. Core Presets Table
        $this->forge->addField([
            'id' => [
                'type' => 'INT', 'unsigned' => true, 'auto_increment' => true
            ],
            'name' => [
                'type' => 'VARCHAR', 'constraint' => '100'
            ],
            'description' => [
                'type' => 'TEXT'
            ],
            'category' => [
                'type' => 'VARCHAR', 'constraint' => '50'
            ],
            'price' => [
                'type' => 'DECIMAL', 'constraint' => '10,2'
            ],
            'drive_link' => [
                'type' => 'VARCHAR', 'constraint' => '255', 'null' => true
            ],
            'created_by' => [
                'type' => 'INT', 'unsigned' => true, 'null' => true
            ],
            'is_featured' => [
                'type' => 'TINYINT', 'constraint' => 1, 'default' => 0
            ],
            'created_at' => ['type' => 'DATETIME', 'null' => true],
            'updated_at' => ['type' => 'DATETIME', 'null' => true],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('created_by', 'users', 'id', 'SET NULL', 'CASCADE');
        $this->forge->createTable('presets');

        // 2. Preset Images (Normalized from MongoDB Array)
        $this->forge->addField([
            'id' => ['type' => 'INT', 'unsigned' => true, 'auto_increment' => true],
            'preset_id' => ['type' => 'INT', 'unsigned' => true],
            'path' => ['type' => 'VARCHAR', 'constraint' => '255'],
            'filename' => ['type' => 'VARCHAR', 'constraint' => '255'],
            'mimetype' => ['type' => 'VARCHAR', 'constraint' => '50'],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('preset_id', 'presets', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('preset_images');
    }

    public function down()
    {
        $this->forge->dropTable('preset_images');
        $this->forge->dropTable('presets');
    }
}