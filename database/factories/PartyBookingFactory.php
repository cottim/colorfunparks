<?php

namespace Database\Factories;

use App\Models\PartyBooking;
use App\Models\User;
use App\PartyBookingStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PartyBooking>
 */
class PartyBookingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'status' => PartyBookingStatus::Pending,
            'park' => fake()->randomElement([
                'Color Party',
                'Yupi Color',
                'Kiddy Color',
            ]),
            'child_name' => fake()->firstName(),
            'child_age' => fake()->numberBetween(3, 14),
            'party_date' => fake()->dateTimeBetween('+1 day', '+3 months'),
            'party_time' => fake()->randomElement(['10:00', '12:30', '15:00']),
            'guests' => fake()->numberBetween(10, 40),
            'program' => fake()->randomElement([
                'Menu Color',
                'Menu Balance',
                'Menu Lunch Party',
            ]),
            'program_choices' => null,
            'contact_phone' => fake()->optional()->phoneNumber(),
            'privacy_accepted_at' => now(),
            'terms_accepted_at' => now(),
        ];
    }

    public function confirmed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => PartyBookingStatus::Confirmed,
        ]);
    }
}
