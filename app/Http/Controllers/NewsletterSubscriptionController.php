<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreNewsletterSubscriptionRequest;
use App\Models\NewsletterSubscription;
use Illuminate\Http\RedirectResponse;

class NewsletterSubscriptionController extends Controller
{
    public function __invoke(
        StoreNewsletterSubscriptionRequest $request,
    ): RedirectResponse {
        NewsletterSubscription::query()->create([
            'email' => $request->validated('email'),
            'consented_at' => now(),
        ]);

        return back();
    }
}
