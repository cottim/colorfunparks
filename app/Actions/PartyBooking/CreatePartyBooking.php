<?php

namespace App\Actions\PartyBooking;

use App\Models\PartyBooking;
use App\Models\User;
use App\UserRole;

class CreatePartyBooking
{
    /**
     * @param  array{
     *     contact_name: string,
     *     email: string|null,
     *     phone: string|null,
     *     privacy_accepted: bool,
     *     terms_accepted: bool,
     *     marketing_accepted: bool,
     *     park: string,
     *     child_name: string,
     *     child_age: int,
     *     party_date: string,
     *     party_time: string,
     *     guests: int,
     *     program: string,
     *     website: string|null
     * } $data
     */
    public function handle(?User $authenticatedUser, array $data): PartyBooking
    {
        $customer = $authenticatedUser?->role === UserRole::Customer
            ? $authenticatedUser
            : null;

        return PartyBooking::query()->create([
            'user_id' => $customer?->id,
            'park' => $this->optionLabel('parks', $data['park']),
            'child_name' => $data['child_name'],
            'child_age' => $data['child_age'],
            'party_date' => $data['party_date'],
            'party_time' => $data['party_time'],
            'guests' => $data['guests'],
            'program' => $this->optionLabel('programs', $data['program']),
            'contact_name' => $data['contact_name'],
            'contact_email' => $data['email'] ?: null,
            'contact_phone' => $data['phone'] ?: null,
            'privacy_accepted_at' => now(),
            'terms_accepted_at' => now(),
        ]);
    }

    private function optionLabel(string $optionGroup, string $value): string
    {
        /** @var list<array{value: string, label: string}> $options */
        $options = config('party_bookings.'.$optionGroup);

        foreach ($options as $option) {
            if ($option['value'] === $value) {
                return $option['label'];
            }
        }

        abort(422);
    }
}
