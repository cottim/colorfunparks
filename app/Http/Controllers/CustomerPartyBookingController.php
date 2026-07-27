<?php

namespace App\Http\Controllers;

use App\Actions\Customer\PresentCustomerPartyBooking;
use App\Models\PartyBooking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class CustomerPartyBookingController extends Controller
{
    public function index(
        Request $request,
        PresentCustomerPartyBooking $presentCustomerPartyBooking,
    ): Response {
        $user = $request->user();

        if ($user === null) {
            abort(401);
        }

        $bookings = $user->partyBookings()
            ->with('user:id,name,email')
            ->latest()
            ->paginate(10)
            ->through($presentCustomerPartyBooking->handle(...));

        return Inertia::render('account/bookings', [
            'bookings' => $bookings,
        ]);
    }

    public function show(
        PartyBooking $partyBooking,
        PresentCustomerPartyBooking $presentCustomerPartyBooking,
    ): Response {
        Gate::authorize('view', $partyBooking);
        $partyBooking->load('user:id,name,email');

        return Inertia::render('account/booking', [
            'booking' => $presentCustomerPartyBooking->handle($partyBooking),
        ]);
    }
}
