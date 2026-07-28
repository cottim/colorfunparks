<?php

namespace App\Actions\Customer;

use App\Models\PartyBooking;

class PresentCustomerPartyBooking
{
    /**
     * @return array{
     *     id: int,
     *     reference: string,
     *     status: string,
     *     statusLabel: string,
     *     park: string,
     *     childName: string,
     *     childAge: int,
     *     partyDate: string,
     *     partyTime: string,
     *     guests: int,
     *     program: string|null,
     *     contactName: string,
     *     contactEmail: string|null,
     *     contactPhone: string|null,
     *     createdAt: string
     * }
     */
    public function handle(PartyBooking $booking): array
    {
        return [
            'id' => $booking->id,
            'reference' => $booking->reference(),
            'status' => $booking->status->value,
            'statusLabel' => $booking->status->label(),
            'park' => $booking->park,
            'childName' => $booking->child_name,
            'childAge' => $booking->child_age,
            'partyDate' => $booking->party_date->toDateString(),
            'partyTime' => $booking->party_time,
            'guests' => $booking->guests,
            'program' => $booking->program,
            'contactName' => $booking->contact_name ?? $booking->user->name,
            'contactEmail' => $booking->contact_email
                ?? $booking->user->email,
            'contactPhone' => $booking->contact_phone,
            'createdAt' => $booking->created_at->toIso8601String(),
        ];
    }
}
