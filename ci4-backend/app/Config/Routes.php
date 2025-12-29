<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

$routes->group('api', function($routes) {
    $routes->post('signup', 'AuthController::signup', ['filter' => 'throttle:5,60']);
    $routes->post('login', 'AuthController::login', ['filter' => 'throttle:5,60']);
    $routes->get('logout', 'AuthController::logout', ['filter' => 'throttle:10,60']);
    $routes->get('profile', 'AuthController::profile', ['filter' => 'session_auth']);
    $routes->get('admin/dashboard', 'AdminController::index', ['filter' => 'role:admin']);

    // Preset Routes
    $routes->get('presets', 'PresetController::index');
    $routes->get('presets/(:num)', 'PresetController::show/$1');
    $routes->post('presets', 'PresetController::create');
    $routes->put('presets/(:num)', 'PresetController::update/$1', ['filter' => 'role:admin']);
    $routes->delete('presets/(:num)', 'PresetController::delete/$1', ['filter' => 'role:admin']);
    
    // Image Management Routes
    $routes->post('presets/(:num)/images', 'PresetController::uploadImages/$1', ['filter' => 'role:admin']);
    $routes->delete('images/(:num)', 'PresetController::deleteImage/$1', ['filter' => 'role:admin']);
});
