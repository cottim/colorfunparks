<?php

namespace App\Http\Controllers;

use App\Actions\Customer\PresentCustomerColorCampRegistration;
use App\Models\ColorCampRegistration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class CustomerColorCampRegistrationController extends Controller
{
    public function index(
        Request $request,
        PresentCustomerColorCampRegistration $presentRegistration,
    ): Response {
        $user = $request->user();

        abort_if($user === null, 401);

        $registrations = $user->colorCampRegistrations()
            ->latest()
            ->paginate(10)
            ->through($presentRegistration->handle(...));

        return Inertia::render('account/color-camp-registrations/index', [
            'registrations' => $registrations,
        ]);
    }

    public function show(
        ColorCampRegistration $colorCampRegistration,
        PresentCustomerColorCampRegistration $presentRegistration,
    ): Response {
        Gate::authorize('view', $colorCampRegistration);

        return Inertia::render('account/color-camp-registrations/show', [
            'registration' => $presentRegistration->handle(
                $colorCampRegistration,
            ),
        ]);
    }
}
