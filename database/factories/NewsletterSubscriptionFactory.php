<?php

namespace Database\Factories;

use App\Models\NewsletterSubscription;
use App\NewsletterSubscriptionStatus;
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
            'email' => fake()->unique()->safeEmail(),
            'status' => NewsletterSubscriptionStatus::Confirmed,
            'consented_at' => now(),
            'confirmation_token_hash' => null,
            'confirmation_sent_at' => now(),
            'confirmed_at' => now(),
            'unsubscribed_at' => null,
            'consent_version' => NewsletterSubscription::CONSENT_VERSION,
            'source' => NewsletterSubscription::HOMEPAGE_SOURCE,
        ];
    }

    public function pending(): static
    {
        return $this->state(fn (): array => [
            'status' => NewsletterSubscriptionStatus::Pending,
            'confirmation_token_hash' => hash('sha256', fake()->uuid()),
            'confirmation_sent_at' => now(),
            'confirmed_at' => null,
            'unsubscribed_at' => null,
        ]);
    }

    public function unsubscribed(): static
    {
        return $this->state(fn (): array => [
            'status' => NewsletterSubscriptionStatus::Unsubscribed,
            'confirmation_token_hash' => null,
            'confirmed_at' => now()->subDay(),
            'unsubscribed_at' => now(),
        ]);
    }
}
