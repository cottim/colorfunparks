<?php

namespace App\Http\Controllers\Management;

use App\Actions\Management\GetCustomers;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function __invoke(GetCustomers $getCustomers): Response
    {
        Gate::authorize('access-management');

        return Inertia::render('management/customers/index', [
            'customers' => $getCustomers->handle(),
        ]);
    }
}
