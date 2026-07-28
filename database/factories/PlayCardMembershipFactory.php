<?php

namespace Database\Factories;

use App\Models\PlayCardMembership;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PlayCardMembership>
 */
class PlayCardMembershipFactory extends Factory
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
            'joined_at' => now()->subMonth(),
            'last_used_at' => null,
            'deactivated_at' => null,
        ];
    }

    public function usedRecently(): static
    {
        return $this->state(fn (): array => [
            'last_used_at' => now(),
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn (): array => [
            'deactivated_at' => now(),
        ]);
    }
}
