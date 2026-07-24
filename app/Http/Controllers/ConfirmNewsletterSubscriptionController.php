<?php

namespace App\Http\Controllers;

use App\Models\NewsletterSubscription;
use App\NewsletterSubscriptionStatus;
use Illuminate\Http\RedirectResponse;

class ConfirmNewsletterSubscriptionController extends Controller
{
    public function __invoke(
        NewsletterSubscription $newsletterSubscription,
        string $token,
    ): RedirectResponse {
        if ($newsletterSubscription->status === NewsletterSubscriptionStatus::Confirmed) {
            return $this->confirmedRedirect();
        }

        abort_unless(
            $newsletterSubscription->confirmation_token_hash !== null
            && hash_equals(
                $newsletterSubscription->confirmation_token_hash,
                hash('sha256', $token),
            ),
            404,
        );

        $newsletterSubscription->update([
            'status' => NewsletterSubscriptionStatus::Confirmed,
            'confirmation_token_hash' => null,
            'confirmed_at' => now(),
            'unsubscribed_at' => null,
        ]);

        return $this->confirmedRedirect();
    }

    private function confirmedRedirect(): RedirectResponse
    {
        return redirect(
            route('home', ['newsletter' => 'confirmed']).'#newsletter',
        );
    }
}
