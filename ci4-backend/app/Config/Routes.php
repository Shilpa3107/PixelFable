<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

$routes->group('api', function($routes) {
    $routes->post('signup', 'AuthController::signup');
    $routes->post('login', 'AuthController::login');
    $routes->get('logout', 'AuthController::logout');
    $routes->get('profile', 'AuthController::profile', ['filter' => 'session_auth']);
    $routes->get('admin/dashboard', 'AdminController::index', ['filter' => 'admin']);
});

