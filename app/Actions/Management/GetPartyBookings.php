<?php

namespace App\Actions\Management;

use App\Models\PartyBooking;
use App\Models\User;

/**
 * @phpstan-type ManagedPartyBooking array{
 *     id: int,
 *     status: array{value: string, label: string},
 *     customer: array{name: string, email: string},
 *     park: string,
 *     child: array{name: string, age: int},
 *     party_date: string,
 *     party_time: string,
 *     guests: int,
 *     program: string,
 *     created_at: string|null
 * }
 */
class GetPartyBookings
{
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
                'contact_name',
                'contact_email',
                'created_at',
            ])
            ->with('user:id,name,email')
            ->latest('id')
            ->paginate(20)
            ->withQueryString()
            ->through(
                fn (PartyBooking $partyBooking): array => $this->transformBooking(
                    $partyBooking,
                ),
            )
            ->toArray();
    }

    /**
     * @return ManagedPartyBooking
     */
    private function transformBooking(PartyBooking $partyBooking): array
    {
        $customer = $partyBooking->getRelation('user');
        $customerName = $customer instanceof User ? $customer->name : null;
        $customerEmail = $customer instanceof User ? $customer->email : null;

        return [
            'id' => $partyBooking->id,
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
            'created_at' => $partyBooking->created_at?->toISOString(),
        ];
    }
}
