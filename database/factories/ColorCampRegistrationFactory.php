<?php

namespace Database\Factories;

use App\ColorCampRegistrationStatus;
use App\Models\ColorCampRegistration;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ColorCampRegistration>
 */
class ColorCampRegistrationFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'status' => ColorCampRegistrationStatus::Pending,
            'contact_phone' => fake()->phoneNumber(),
            'child_name' => fake()->firstName(),
            'child_birth_date' => fake()->dateTimeBetween(
                '2014-08-04',
                '2022-08-03',
            ),
            'allergies_and_health_notes' => null,
            'health_data_consented_at' => null,
            'health_data_consent_version' => null,
            'authorized_pickup_name' => fake()->name(),
            'authorized_pickup_phone' => fake()->phoneNumber(),
            'attendance_type' => 'weeks',
            'selected_weeks' => ['orange'],
            'selected_days' => null,
            'lunch_option' => 'park',
            'discount' => null,
            'needs_extended_care' => false,
            'trip_authorized' => true,
            'photo_consent' => 'yes',
            'notes' => null,
            'privacy_accepted_at' => now(),
            'terms_accepted_at' => now(),
        ];
    }

    public function confirmed(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => ColorCampRegistrationStatus::Confirmed,
        ]);
    }
}
