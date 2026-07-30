<?php

namespace App\Http\Controllers;

use App\Actions\Newsletter\UnsubscribeFromNewsletter;
use App\Models\NewsletterSubscription;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class NewsletterUnsubscribeController extends Controller
{
    public function __invoke(
        Request $request,
        NewsletterSubscription $newsletterSubscription,
        UnsubscribeFromNewsletter $unsubscribeFromNewsletter,
    ): Response {
        if ($request->isMethod('post')) {
            abort_unless(
                $request->input('List-Unsubscribe') === 'One-Click',
                422,
            );
        }

        $unsubscribeFromNewsletter->handle($newsletterSubscription);

        if ($request->isMethod('post')) {
            return response()->noContent();
        }

        return redirect(
            route('home', ['newsletter' => 'unsubscribed']).'#newsletter',
        );
    }
}
