<?php

namespace App\Models;

use CodeIgniter\Model;

class PresetModel extends Model
{
    protected $table            = 'presets';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false; // Migration doesn't have deleted_at
    protected $protectFields    = true;
    protected $allowedFields    = ['name', 'description', 'category', 'price', 'drive_link', 'created_by', 'is_featured'];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    // Validation
    protected $validationRules      = [
        'name'        => 'required|min_length[3]|max_length[100]',
        'description' => 'required',
        'category'    => 'required|in_list[Portrait,Landscape,Cinematic,Black & White,Vintage,Teal & Orange,Travel]',
        'price'       => 'required|decimal',
        'drive_link'  => 'permit_empty',
    ];
    
    protected $validationMessages   = [];
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;
}
