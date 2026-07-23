<?php

use App\Models\NewsletterSubscription;

test('a visitor can subscribe to the newsletter', function () {
    $response = $this
        ->from(route('home'))
        ->post(route('newsletter-subscriptions.store'), [
            'email' => '  VISITOR@EXAMPLE.COM ',
            'privacy_consent' => '1',
        ]);

    $response->assertRedirect(route('home'))->assertSessionHasNoErrors();

    $subscription = NewsletterSubscription::query()->sole();

    expect($subscription->email)
        ->toBe('visitor@example.com')
        ->and($subscription->consented_at)
        ->not->toBeNull();
});

test('a newsletter subscription requires a valid email and consent', function () {
    $response = $this
        ->from(route('home'))
        ->post(route('newsletter-subscriptions.store'), [
            'email' => 'invalid-email',
        ]);

    $response
        ->assertRedirect(route('home'))
        ->assertSessionHasErrors(['email', 'privacy_consent']);
});

test('an email address cannot subscribe more than once', function () {
    NewsletterSubscription::factory()->create([
        'email' => 'visitor@example.com',
    ]);

    $response = $this
        ->from(route('home'))
        ->post(route('newsletter-subscriptions.store'), [
            'email' => 'VISITOR@EXAMPLE.COM',
            'privacy_consent' => '1',
        ]);

    $response
        ->assertRedirect(route('home'))
        ->assertSessionHasErrors('email');
});
