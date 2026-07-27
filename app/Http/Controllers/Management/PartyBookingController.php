<?php

namespace App\Http\Controllers\Management;

use App\Actions\Management\GetPartyBookings;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class PartyBookingController extends Controller
{
    public function __invoke(GetPartyBookings $getPartyBookings): Response
    {
        Gate::authorize('access-management');

        return Inertia::render('management/bookings/index', [
            'party_bookings' => $getPartyBookings->handle(),
        ]);
    }
}
