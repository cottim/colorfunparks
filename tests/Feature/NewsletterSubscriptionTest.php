<?php

use App\Models\NewsletterSubscription;
use App\Models\User;

test('a visitor can subscribe to the newsletter', function () {
    $response = $this->postJson(route('newsletter-subscriptions.store'), [
        'email' => '  VISITOR@EXAMPLE.COM ',
        'privacy_consent' => true,
    ]);

    $response->assertOk()->assertExactJson([
        'message' => 'Se este email ainda não recebia as nossas novidades, a inscrição foi registada.',
    ]);

    $user = User::query()->where('email', 'visitor@example.com')->sole();
    $subscription = NewsletterSubscription::query()->sole();

    expect($user->name)
        ->toBe('')
        ->and($user->email_verified_at)
        ->toBeNull()
        ->and($subscription->user->is($user))
        ->toBeTrue()
        ->and($subscription->consented_at)
        ->not->toBeNull()
        ->and($subscription->consent_version)
        ->toBe(NewsletterSubscription::CONSENT_VERSION)
        ->and($subscription->source)
        ->toBe(NewsletterSubscription::HOMEPAGE_SOURCE);
});

test('a newsletter subscription requires a valid email and consent', function () {
    $response = $this->postJson(route('newsletter-subscriptions.store'), [
        'email' => 'invalid-email',
    ]);

    $response
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['email', 'privacy_consent']);
});

test('subscribing repeatedly returns the same neutral response', function () {
    $user = User::factory()->create([
        'email' => 'visitor@example.com',
    ]);

    $firstResponse = $this->postJson(
        route('newsletter-subscriptions.store'),
        [
            'email' => 'VISITOR@EXAMPLE.COM',
            'privacy_consent' => true,
        ],
    );
    $secondResponse = $this->postJson(
        route('newsletter-subscriptions.store'),
        [
            'email' => 'visitor@example.com',
            'privacy_consent' => true,
        ],
    );

    $expectedResponse = [
        'message' => 'Se este email ainda não recebia as nossas novidades, a inscrição foi registada.',
    ];

    $firstResponse->assertOk()->assertExactJson($expectedResponse);
    $secondResponse->assertOk()->assertExactJson($expectedResponse);

    expect(User::query()->where('email', $user->email)->count())
        ->toBe(1)
        ->and(NewsletterSubscription::query()->count())
        ->toBe(1);
});
