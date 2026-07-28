<?php

namespace App\Actions\Management;

use App\Models\PartyBooking;

class GetPartyBookings
{
    public function __construct(
        private readonly PresentPartyBooking $presentPartyBooking,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function handle(): array
    {
        return PartyBooking::query()
            ->select([
                'id',
                'user_id',
                'status',
                'park',
                'child_name',
                'child_age',
                'party_date',
                'party_time',
                'guests',
                'program',
                'program_choices',
                'contact_name',
                'contact_email',
                'contact_phone',
                'created_at',
            ])
            ->with('user:id,name,email')
            ->latest('id')
            ->paginate(20)
            ->withQueryString()
            ->through(
                $this->presentPartyBooking->handle(...),
            )
            ->toArray();
    }
}
