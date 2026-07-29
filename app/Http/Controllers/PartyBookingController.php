<?php

namespace App\Http\Controllers;

use App\Actions\Customer\GetCustomerPreferences;
use App\Actions\Customer\RecordCustomerLegalConsent;
use App\Actions\Newsletter\SubscribeToNewsletter;
use App\Actions\PartyBooking\CreatePartyBooking;
use App\Actions\PartyBooking\GetInitialPartyProgramSelection;
use App\Actions\PartyBooking\SendPartyBookingReceipt;
use App\Http\Requests\StorePartyBookingRequest;
use App\UserRole;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PartyBookingController extends Controller
{
    public function create(
        Request $request,
        GetInitialPartyProgramSelection $getInitialPartyProgramSelection,
        GetCustomerPreferences $getCustomerPreferences,
    ): Response {
        $queryChoices = $request->query('choices', []);
        $customer = $request->user()?->role === UserRole::Customer
            ? $request->user()
            : null;
        $preferences = $customer !== null
            ? $getCustomerPreferences->handle($customer)
            : null;

        return Inertia::render('party-bookings/create', [
            'authenticatedCustomer' => $customer !== null
                ? [
                    'name' => $customer->name,
                    'email' => $customer->email,
                    'hasAcceptedLegalConsent' => $customer
                        ->hasAcceptedCurrentLegalConsent(),
                    'marketing' => $preferences['marketing'],
                ]
                : null,
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
        SendPartyBookingReceipt $sendPartyBookingReceipt,
        SubscribeToNewsletter $subscribeToNewsletter,
        RecordCustomerLegalConsent $recordCustomerLegalConsent,
    ): RedirectResponse {
        $data = $request->partyBookingData();

        if (
            $request->authenticatedCustomer() !== null
            && ! $request->authenticatedCustomer()
                ->hasAcceptedCurrentLegalConsent()
        ) {
            $recordCustomerLegalConsent->handle(
                $request->authenticatedCustomer(),
            );
        }

        $booking = $createPartyBooking->handle($request->user(), $data);
        $sendPartyBookingReceipt->handle($booking);

        if (
            $request->authenticatedCustomer() === null
            && $data['marketing_accepted']
            && $data['email']
        ) {
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
