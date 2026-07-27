<?php

namespace App\Http\Controllers\Management;

use App\Actions\Management\GetDashboard;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(GetDashboard $getDashboard): Response
    {
        Gate::authorize('access-management');

        return Inertia::render(
            'management/dashboard',
            $getDashboard->handle(),
        );
    }
}
