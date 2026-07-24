<?php

namespace App\Http\Controllers\Management;

use App\Actions\Management\GetManagementOverview;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ManagementController extends Controller
{
    public function __invoke(GetManagementOverview $getManagementOverview): Response
    {
        Gate::authorize('access-management');

        return Inertia::render(
            'management/index',
            $getManagementOverview->handle(),
        );
    }
}
