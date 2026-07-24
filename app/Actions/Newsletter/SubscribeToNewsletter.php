<?php

namespace App\Actions\Newsletter;

use App\Models\NewsletterSubscription;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SubscribeToNewsletter
{
    public function handle(string $email): NewsletterSubscription
    {
        return DB::transaction(function () use ($email): NewsletterSubscription {
            $user = User::query()->firstOrCreate(
                ['email' => $email],
                [
                    'name' => '',
                    'password' => Str::random(64),
                ],
            );

            return $user->newsletterSubscription()->updateOrCreate(
                [],
                [
                    'consented_at' => now(),
                    'unsubscribed_at' => null,
                    'consent_version' => NewsletterSubscription::CONSENT_VERSION,
                    'source' => NewsletterSubscription::HOMEPAGE_SOURCE,
                ],
            );
        });
    }
}
