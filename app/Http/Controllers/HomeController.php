<?php

namespace App\Http\Controllers;

use App\Actions\Article\GetLatestArticlePreviews;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(
        Request $request,
        GetLatestArticlePreviews $latestArticlePreviews,
    ): Response {
        return Inertia::render('welcome', [
            'partyPrograms' => config('party_bookings.programs'),
            'sharedPartyProgramIncludes' => config(
                'party_bookings.shared_program_includes',
            ),
            'partyProgramBadges' => config(
                'party_bookings.program_badges',
            ),
            'partyProgramConditions' => config(
                'party_bookings.program_conditions',
            ),
            'latestArticles' => $latestArticlePreviews->handle(
                (int) config('content.homepage_article_limit'),
            ),
            'isAuthenticated' => $request->user() !== null,
            'showNewsletter' => ! (
                $request->user()?->hasAuthorizedMarketing() ?? false
            ),
        ]);
    }
}
