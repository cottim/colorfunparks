<?php

namespace App\Actions\Newsletter;

use App\Models\NewsletterSubscription;
use App\NewsletterSubscriptionStatus;

class UnsubscribeFromNewsletter
{
    public function handle(
        NewsletterSubscription $subscription,
    ): NewsletterSubscription {
        if (
            $subscription->status === NewsletterSubscriptionStatus::Unsubscribed
        ) {
            return $subscription;
        }

        $subscription->update([
            'status' => NewsletterSubscriptionStatus::Unsubscribed,
            'confirmation_token_hash' => null,
            'confirmation_sent_at' => null,
            'unsubscribed_at' => now(),
        ]);

        return $subscription;
    }
}
