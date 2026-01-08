<?php

namespace App\Controllers;

class CheckoutController extends BaseController
{
    /**
     * Display the checkout page
     */
    public function index()
    {
        return view('checkout');
    }
}
