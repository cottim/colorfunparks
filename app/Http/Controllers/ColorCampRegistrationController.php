<?php

namespace App\Http\Controllers;

use App\Actions\ColorCamp\CreateColorCampRegistration;
use App\Http\Requests\StoreColorCampRegistrationRequest;
use App\UserRole;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ColorCampRegistrationController extends Controller
{
    public function create(Request $request): Response
    {
        $user = $request->user();
        $authenticatedCustomer = $user?->role === UserRole::Customer
            ? $user->only(['name', 'email'])
            : null;

        return Inertia::render('color-camp-registrations/create', [
            'authenticatedCustomer' => $authenticatedCustomer,
            'registrationOptions' => [
                'season' => config('color_camp.season'),
                'minimumAge' => config('color_camp.minimum_age'),
                'maximumAge' => config('color_camp.maximum_age'),
                'weeks' => config('color_camp.weeks'),
                'days' => config('color_camp.days'),
                'lunchOptions' => config('color_camp.lunch_options'),
                'discounts' => config('color_camp.discounts'),
                'photoConsents' => config('color_camp.photo_consents'),
            ],
        ]);
    }

    public function store(
        StoreColorCampRegistrationRequest $request,
        CreateColorCampRegistration $createRegistration,
    ): RedirectResponse {
        $registration = $createRegistration->handle(
            $request->user(),
            $request->registrationData(),
        );

        if ($registration->user_id !== null) {
            return to_route(
                'account.color-camp-registrations.show',
                $registration,
            );
        }

        return to_route('color-camp-registrations.received');
    }
}
