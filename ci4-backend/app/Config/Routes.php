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
});
