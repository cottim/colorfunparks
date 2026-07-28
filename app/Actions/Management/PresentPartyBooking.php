<?php

namespace App\Actions\Management;

use App\Models\PartyBooking;
use App\Models\User;

class PresentPartyBooking
{
    /**
     * @return array{
     *     id: int,
     *     reference: string,
     *     status: array{value: string, label: string},
     *     customer: array{name: string, email: string, phone: string|null},
     *     park: string,
     *     child: array{name: string, age: int},
     *     party_date: string,
     *     party_time: string,
     *     guests: int,
     *     program: string,
     *     program_choices: array<string, array{group: string, value: string, label: string}>|null,
     *     total_cents: null,
     *     payment_status: null,
     *     created_at: string|null
     * }
     */
    public function handle(PartyBooking $partyBooking): array
    {
        $customer = $partyBooking->getRelation('user');
        $customerName = $customer instanceof User ? $customer->name : null;
        $customerEmail = $customer instanceof User ? $customer->email : null;

        return [
            'id' => $partyBooking->id,
            'reference' => $partyBooking->reference(),
            'status' => [
                'value' => $partyBooking->status->value,
                'label' => $partyBooking->status->label(),
            ],
            'customer' => [
                'name' => $partyBooking->contact_name
                    ?? $customerName
                    ?? 'Sem nome',
                'email' => $partyBooking->contact_email
                    ?? $customerEmail
                    ?? 'Sem email',
                'phone' => $partyBooking->contact_phone,
            ],
            'park' => $partyBooking->park,
            'child' => [
                'name' => $partyBooking->child_name,
                'age' => $partyBooking->child_age,
            ],
            'party_date' => $partyBooking->party_date->toDateString(),
            'party_time' => $partyBooking->party_time,
            'guests' => $partyBooking->guests,
            'program' => $partyBooking->program,
            'program_choices' => $partyBooking->program_choices,
            'total_cents' => null,
            'payment_status' => null,
            'created_at' => $partyBooking->created_at?->toISOString(),
        ];
    }
}
