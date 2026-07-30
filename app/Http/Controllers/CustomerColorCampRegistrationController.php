<?php

namespace App\Http\Controllers;

use App\Actions\ColorCamp\PresentColorCampRegistrationSummary;
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
        PresentColorCampRegistrationSummary $presentRegistration,
    ): Response {
        $user = $request->user();

        abort_if($user === null, 401);

        $registrations = $user->colorCampRegistrations()
            ->select([
                'id',
                'reference_code',
                'user_id',
                'status',
                'child_name',
                'attendance_type',
                'selected_weeks',
                'selected_days',
                'created_at',
            ])
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
