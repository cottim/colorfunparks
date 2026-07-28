<?php

namespace App\Actions\ColorCamp;

use App\Models\ColorCampRegistration;
use App\Models\User;
use App\UserRole;

class CreateColorCampRegistration
{
    /**
     * @param  array{
     *     contact_name: string|null,
     *     email: string|null,
     *     phone: string,
     *     child_name: string,
     *     child_birth_date: string,
     *     allergies_and_health_notes: string|null,
     *     authorized_pickup_name: string,
     *     authorized_pickup_phone: string,
     *     attendance_type: string,
     *     selected_weeks: list<string>,
     *     selected_days: list<string>,
     *     lunch_option: string,
     *     discount: string|null,
     *     needs_extended_care: bool,
     *     trip_authorized: bool,
     *     photo_consent: string,
     *     notes: string|null
     * } $data
     */
    public function handle(
        ?User $authenticatedUser,
        array $data,
    ): ColorCampRegistration {
        $customer = $authenticatedUser?->role === UserRole::Customer
            ? $authenticatedUser
            : null;

        return ColorCampRegistration::query()->create([
            'user_id' => $customer?->id,
            'contact_name' => $customer !== null
                ? $customer->name
                : $data['contact_name'],
            'contact_email' => $customer !== null
                ? $customer->email
                : $data['email'],
            'contact_phone' => $data['phone'],
            'child_name' => $data['child_name'],
            'child_birth_date' => $data['child_birth_date'],
            'allergies_and_health_notes' => $data[
                'allergies_and_health_notes'
            ],
            'authorized_pickup_name' => $data['authorized_pickup_name'],
            'authorized_pickup_phone' => $data[
                'authorized_pickup_phone'
            ],
            'attendance_type' => $data['attendance_type'],
            'selected_weeks' => $data['attendance_type'] === 'weeks'
                ? $data['selected_weeks']
                : null,
            'selected_days' => $data['attendance_type'] === 'days'
                ? $data['selected_days']
                : null,
            'lunch_option' => $data['lunch_option'],
            'discount' => $data['discount'],
            'needs_extended_care' => $data['needs_extended_care'],
            'trip_authorized' => $data['trip_authorized'],
            'photo_consent' => $data['photo_consent'],
            'notes' => $data['notes'],
            'privacy_accepted_at' => now(),
            'terms_accepted_at' => now(),
        ]);
    }
}
