<?php

namespace App\Models;

use CodeIgniter\Model;

class PresetImageModel extends Model
{
    protected $table            = 'preset_images';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $allowedFields    = ['preset_id', 'path', 'filename', 'mimetype'];

    // Dates
    protected $useTimestamps = false;
}
