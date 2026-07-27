<?php

namespace Database\Factories;

use App\Models\CustomerLoginLink;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<CustomerLoginLink>
 */
class CustomerLoginLinkFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'email' => fake()->unique()->safeEmail(),
            'token_hash' => hash('sha256', Str::random(64)),
            'expires_at' => now()->addMinutes(
                (int) config(
                    'customer_auth.login_link_expiration_minutes',
                ),
            ),
            'used_at' => null,
        ];
    }
}
