<?php

namespace App\Actions\Newsletter;

use App\Mail\ConfirmNewsletterSubscriptionMail;
use App\Models\NewsletterSubscription;
use App\NewsletterSubscriptionStatus;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class SubscribeToNewsletter
{
    public function handle(
        string $email,
        string $source = NewsletterSubscription::HOMEPAGE_SOURCE,
    ): NewsletterSubscription {
        $lockName = 'newsletter-subscription:'.hash('sha256', $email);

        return Cache::lock($lockName, 10)->block(
            3,
            function () use ($email, $source): NewsletterSubscription {
                $subscription = NewsletterSubscription::query()
                    ->firstOrNew(['email' => $email]);

                if (
                    $subscription->exists
                    && $subscription->status === NewsletterSubscriptionStatus::Confirmed
                    && $subscription->unsubscribed_at === null
                ) {
                    return $subscription;
                }

                $subscription->fill([
                    'status' => NewsletterSubscriptionStatus::Pending,
                    'consented_at' => now(),
                    'unsubscribed_at' => null,
                    'consent_version' => NewsletterSubscription::CONSENT_VERSION,
                    'source' => $source,
                ]);

                $resendAvailableAt = $subscription->confirmation_sent_at?->addMinutes(
                    (int) config('newsletter.confirmation_resend_cooldown_minutes'),
                );

                if ($resendAvailableAt !== null && $resendAvailableAt->isFuture()) {
                    $subscription->save();

                    return $subscription;
                }

                $plainTextToken = Str::random(64);

                $subscription->fill([
                    'confirmation_token_hash' => hash('sha256', $plainTextToken),
                    'confirmation_sent_at' => now(),
                    'confirmed_at' => null,
                ])->save();

                Mail::to($subscription->email)->send(
                    new ConfirmNewsletterSubscriptionMail(
                        $subscription,
                        $plainTextToken,
                    ),
                );

                return $subscription;
            },
        );
    }
}
