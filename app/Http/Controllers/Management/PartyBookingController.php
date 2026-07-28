<?php

namespace App\Http\Controllers\Management;

use App\Actions\Management\GetPartyBookings;
use App\Actions\Management\PresentPartyBooking;
use App\Http\Controllers\Controller;
use App\Models\PartyBooking;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class PartyBookingController extends Controller
{
    public function index(GetPartyBookings $getPartyBookings): Response
    {
        Gate::authorize('access-management');

        return Inertia::render('management/bookings/index', [
            'party_bookings' => $getPartyBookings->handle(),
        ]);
    }

    public function show(
        PartyBooking $partyBooking,
        PresentPartyBooking $presentPartyBooking,
    ): Response {
        Gate::authorize('access-management');
        $partyBooking->load('user:id,name,email');

        return Inertia::render('management/bookings/show', [
            'party_booking' => $presentPartyBooking->handle($partyBooking),
        ]);
    }
}
