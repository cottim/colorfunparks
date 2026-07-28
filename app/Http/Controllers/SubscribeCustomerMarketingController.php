<?php

namespace App\Http\Controllers;

use App\Actions\Newsletter\SubscribeToNewsletter;
use App\Models\NewsletterSubscription;
use App\Models\User;
use App\NewsletterSubscriptionStatus;
use App\UserRole;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscribeCustomerMarketingController extends Controller
{
    public function __invoke(
        Request $request,
        SubscribeToNewsletter $subscribeToNewsletter,
    ): RedirectResponse {
        $user = $request->user();

        abort_unless(
            $user instanceof User && $user->role === UserRole::Customer,
            403,
        );

        $subscription = $subscribeToNewsletter->handle(
            $user->email,
            NewsletterSubscription::CUSTOMER_ACCOUNT_SOURCE,
        );

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $subscription->status === NewsletterSubscriptionStatus::Confirmed
                ? 'Já estás a receber as nossas novidades.'
                : 'Enviámos um email para confirmares a subscrição.',
        ]);

        return to_route('account.preferences.edit');
    }
}
