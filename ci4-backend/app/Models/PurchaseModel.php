<?php

namespace App\Models;

use CodeIgniter\Model;

class PurchaseModel extends Model
{
    protected $table            = 'purchases';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $allowedFields    = [
        'preset_id', 
        'transaction_id', 
        'customer_email', 
        'customer_name', 
        'price_paid', 
        'status', 
        'razorpay_order_id', 
        'razorpay_payment_id', 
        'razorpay_signature'
    ];

    // Dates
    protected $useTimestamps = true;
    protected $dateFormat    = 'datetime';
    protected $createdField  = 'created_at';
    protected $updatedField  = ''; // No updated_at field in migration
    protected $deletedField  = '';
}
