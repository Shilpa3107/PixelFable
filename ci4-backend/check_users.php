<?php
// Simple script to check database content
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/vendor/codeigniter4/framework/system/Test/bootstrap.php';

$db = \Config\Database::connect();
$query = $db->query('SELECT id, email, role FROM users');
$results = $query->getResultArray();

echo "USER LIST:\n";
print_r($results);
