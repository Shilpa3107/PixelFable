<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

// Web Auth Routes
$routes->get('login', 'AuthController::loginPage');
$routes->get('signup', 'AuthController::signupPage');

$routes->group('api', function($routes) {
    // Public/Auth Routes
    $routes->post('signup', 'AuthController::signup', ['filter' => 'throttle:5,60']);
    $routes->post('login', 'AuthController::login', ['filter' => 'throttle:5,60']);
    $routes->get('logout', 'AuthController::logout', ['filter' => 'throttle:10,60']);
    $routes->get('profile', 'AuthController::profile', ['filter' => 'session_auth']);

    // Public Preset Routes
    $routes->get('presets', 'PresetController::index');
    $routes->get('presets/(:num)', 'PresetController::show/$1');

    // Admin Group
    $routes->group('admin', ['filter' => 'role:admin'], function($routes) {
        $routes->get('dashboard', 'AdminController::index');
        
        // User Management
        $routes->get('users', 'AdminController::users');
        $routes->put('users/(:num)', 'AdminController::updateUser/$1');
        $routes->delete('users/(:num)', 'AdminController::deleteUser/$1');

        // Preset Admin CRUD
        $routes->post('presets', 'PresetController::create');
        $routes->put('presets/(:num)', 'PresetController::update/$1');
        $routes->delete('presets/(:num)', 'PresetController::delete/$1');
        
        // Image Management
        $routes->post('presets/(:num)/images', 'PresetController::uploadImages/$1');
        $routes->delete('images/(:num)', 'PresetController::deleteImage/$1');
    });

    // Payment Routes (Razorpay)
    $routes->group('payments', function($routes) {
        $routes->post('create-order', 'PaymentController::createOrder');
        $routes->post('verify-payment', 'PaymentController::verifyPayment');
        $routes->post('webhook', 'PaymentController::webhook');
        $routes->get('success/(:any)', 'PaymentController::success/$1');
        $routes->get('test-email', 'PaymentController::testEmail');
    });
});

$routes->get('checkout', 'CheckoutController::index');
