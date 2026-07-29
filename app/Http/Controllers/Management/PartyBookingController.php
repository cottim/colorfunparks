<?php

namespace App\Http\Controllers\Management;

use App\Actions\Management\GetPartyBookings;
use App\Actions\Management\PresentPartyBooking;
use App\Actions\PartyBooking\SetPartyBookingArchivedState;
use App\Http\Controllers\Controller;
use App\Models\PartyBooking;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class PartyBookingController extends Controller
{
    public function index(
        Request $request,
        GetPartyBookings $getPartyBookings,
    ): Response {
        Gate::authorize('access-management');
        $showArchived = $request->boolean('arquivadas');

        return Inertia::render('management/bookings/index', [
            'party_bookings' => $getPartyBookings->handle($showArchived),
            'show_archived' => $showArchived,
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
            'permissions' => [
                'archive' => Gate::allows('archive', $partyBooking),
                'delete' => Gate::allows('delete', $partyBooking),
            ],
        ]);
    }

    public function archive(
        PartyBooking $partyBooking,
        SetPartyBookingArchivedState $setArchivedState,
    ): RedirectResponse {
        Gate::authorize('archive', $partyBooking);
        $setArchivedState->handle($partyBooking, true);

        return to_route('management.bookings.show', $partyBooking)
            ->with('success', 'A festa foi arquivada.');
    }

    public function unarchive(
        PartyBooking $partyBooking,
        SetPartyBookingArchivedState $setArchivedState,
    ): RedirectResponse {
        Gate::authorize('archive', $partyBooking);
        $setArchivedState->handle($partyBooking, false);

        return to_route('management.bookings.show', $partyBooking)
            ->with('success', 'A festa voltou à lista de festas ativas.');
    }

    public function destroy(PartyBooking $partyBooking): RedirectResponse
    {
        Gate::authorize('delete', $partyBooking);
        $reference = $partyBooking->reference();
        $partyBooking->delete();

        return to_route('management.bookings.index')
            ->with('success', "A festa {$reference} foi eliminada.");
    }
}
