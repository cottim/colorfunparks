<?php

namespace Database\Factories;

use App\Models\NewsletterSubscription;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<NewsletterSubscription>
 */
class NewsletterSubscriptionFactory extends Factory
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
            'consented_at' => now(),
            'unsubscribed_at' => null,
            'consent_version' => NewsletterSubscription::CONSENT_VERSION,
            'source' => NewsletterSubscription::HOMEPAGE_SOURCE,
        ];
    }
}
