<?php

namespace App\Http\Controllers;

use App\Actions\Newsletter\SubscribeToNewsletter;
use App\Actions\PartyBooking\CreatePartyBooking;
use App\Actions\PartyBooking\GetInitialPartyProgramSelection;
use App\Http\Requests\StorePartyBookingRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PartyBookingController extends Controller
{
    public function create(
        Request $request,
        GetInitialPartyProgramSelection $getInitialPartyProgramSelection,
    ): Response {
        $queryChoices = $request->query('choices', []);

        return Inertia::render('party-bookings/create', [
            'bookingOptions' => [
                'maxBookingMonthsAhead' => (int) config(
                    'party_bookings.max_months_ahead',
                ),
                'parks' => config('party_bookings.parks'),
                'programs' => config('party_bookings.programs'),
                'partyTimes' => config('party_bookings.party_times'),
            ],
            'initialProgramSelection' => $getInitialPartyProgramSelection->handle(
                $request->string('program')->toString(),
                is_array($queryChoices) ? $queryChoices : [],
            ),
        ]);
    }

    public function store(
        StorePartyBookingRequest $request,
        CreatePartyBooking $createPartyBooking,
        SubscribeToNewsletter $subscribeToNewsletter,
    ): RedirectResponse {
        $data = $request->partyBookingData();
        $booking = $createPartyBooking->handle($request->user(), $data);

        if ($data['marketing_accepted'] && $data['email']) {
            defer(
                fn () => $subscribeToNewsletter->handle($data['email']),
            );
        }

        if ($booking->user_id !== null) {
            return to_route('account.bookings.show', $booking);
        }

        return to_route('party-bookings.received');
    }
}
