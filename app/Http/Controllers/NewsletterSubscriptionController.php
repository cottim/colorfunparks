<?php

namespace App\Http\Controllers;

use App\Actions\Newsletter\SubscribeToNewsletter;
use App\Http\Requests\StoreNewsletterSubscriptionRequest;
use Illuminate\Http\JsonResponse;

class NewsletterSubscriptionController extends Controller
{
    public function __invoke(
        StoreNewsletterSubscriptionRequest $request,
        SubscribeToNewsletter $subscribeToNewsletter,
    ): JsonResponse {
        $subscribeToNewsletter->handle($request->validated('email'));

        return response()->json([
            'message' => 'Se este email ainda não recebia as nossas novidades, a inscrição foi registada.',
        ]);
    }
}
