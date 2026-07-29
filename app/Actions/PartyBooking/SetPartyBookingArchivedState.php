<?php

namespace App\Actions\PartyBooking;

use App\Models\PartyBooking;

class SetPartyBookingArchivedState
{
    public function handle(
        PartyBooking $partyBooking,
        bool $isArchived,
    ): void {
        $partyBooking->update([
            'archived_at' => $isArchived ? now() : null,
        ]);
    }
}
