<?php

namespace App\Http\Controllers;

use App\Actions\Newsletter\UnsubscribeFromNewsletter;
use App\Models\User;
use App\UserRole;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UnsubscribeCustomerMarketingController extends Controller
{
    public function __invoke(
        Request $request,
        UnsubscribeFromNewsletter $unsubscribeFromNewsletter,
    ): RedirectResponse {
        $user = $request->user();

        abort_unless(
            $user instanceof User && $user->role === UserRole::Customer,
            403,
        );

        $subscription = $user->newsletterSubscription()->first();

        if ($subscription !== null) {
            $unsubscribeFromNewsletter->handle($subscription);
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Deixaste de receber emails de marketing.',
        ]);

        return to_route('account.preferences.edit');
    }
}
