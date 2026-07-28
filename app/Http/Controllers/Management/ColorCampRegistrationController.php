<?php

namespace App\Http\Controllers\Management;

use App\Actions\Management\GetColorCampRegistrations;
use App\Actions\Management\PresentColorCampRegistration;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateColorCampRegistrationRequest;
use App\Models\ColorCampRegistration;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ColorCampRegistrationController extends Controller
{
    public function index(
        GetColorCampRegistrations $getRegistrations,
    ): Response {
        Gate::authorize('access-management');

        return Inertia::render(
            'management/color-camp-registrations/index',
            ['registrations' => $getRegistrations->handle()],
        );
    }

    public function show(
        ColorCampRegistration $colorCampRegistration,
        PresentColorCampRegistration $presentRegistration,
    ): Response {
        Gate::authorize('access-management');
        $colorCampRegistration->load('user:id,name,email');

        return Inertia::render(
            'management/color-camp-registrations/show',
            [
                'registration' => $presentRegistration->handle(
                    $colorCampRegistration,
                ),
            ],
        );
    }

    public function update(
        UpdateColorCampRegistrationRequest $request,
        ColorCampRegistration $colorCampRegistration,
    ): RedirectResponse {
        $colorCampRegistration->update($request->validated());

        return back()->with(
            'success',
            'Estado da inscrição atualizado.',
        );
    }
}
