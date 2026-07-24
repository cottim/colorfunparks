<?php

namespace App\Http\Controllers;

use App\Actions\Newsletter\SubscribeToNewsletter;
use App\Http\Requests\StoreNewsletterSubscriptionRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class NewsletterSubscriptionController extends Controller
{
    public function __invoke(
        StoreNewsletterSubscriptionRequest $request,
        SubscribeToNewsletter $subscribeToNewsletter,
    ): JsonResponse {
        $subscribeToNewsletter->handle($request->validated('email'));

        return response()->json([
            'message' => 'Se o endereço puder ser subscrito, receberás um email para confirmar a inscrição.',
            'masked_email' => Str::mask(
                $request->validated('email'),
                '*',
                1,
                max(
                    1,
                    Str::length(Str::before($request->validated('email'), '@')) - 1,
                ),
            ),
            'expiration_minutes' => (int) config(
                'newsletter.confirmation_expiration_minutes',
            ),
        ]);
    }
}
