<?php

use App\Mail\ConfirmNewsletterSubscriptionMail;
use App\Models\NewsletterSubscription;
use App\Models\User;
use App\NewsletterSubscriptionStatus;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Inertia\Testing\AssertableInertia as Assert;

test('the homepage hides the newsletter for authenticated confirmed subscribers', function () {
    $guestResponse = $this->get(route('home'));

    $guestResponse->assertOk()->assertInertia(
        fn (Assert $page) => $page
            ->where('isAuthenticated', false)
            ->where('showNewsletter', true),
    );

    $customer = User::factory()->create();
    NewsletterSubscription::factory()->pending()->create([
        'email' => $customer->email,
    ]);

    $this->actingAs($customer)
        ->get(route('home'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page->where(
                'isAuthenticated',
                true,
            )->where(
                'showNewsletter',
                true,
            ),
        );

    $customer->newsletterSubscription()->update([
        'status' => NewsletterSubscriptionStatus::Confirmed,
        'confirmed_at' => now(),
        'confirmation_token_hash' => null,
    ]);

    $this->actingAs($customer)
        ->get(route('home'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page->where(
                'isAuthenticated',
                true,
            )->where(
                'showNewsletter',
                false,
            ),
        );
});

test('a visitor receives an email to confirm a pending newsletter subscription', function () {
    Mail::fake();

    $response = $this->postJson(route('newsletter-subscriptions.store'), [
        'email' => '  VISITOR@EXAMPLE.COM ',
        'privacy_consent' => true,
        'website' => '',
    ]);

    $response->assertOk()->assertExactJson([
        'message' => 'Se o endereço puder ser subscrito, receberás um email para confirmar a inscrição.',
        'masked_email' => 'v******@example.com',
        'expiration_minutes' => 60,
    ]);

    $subscription = NewsletterSubscription::query()->sole();

    expect(User::query()->count())
        ->toBe(0)
        ->and($subscription->email)
        ->toBe('visitor@example.com')
        ->and($subscription->status)
        ->toBe(NewsletterSubscriptionStatus::Pending)
        ->and($subscription->confirmation_token_hash)
        ->not->toBeNull()
        ->and($subscription->confirmation_sent_at)
        ->not->toBeNull()
        ->and($subscription->confirmed_at)
        ->toBeNull()
        ->and($subscription->consent_version)
        ->toBe(NewsletterSubscription::CONSENT_VERSION)
        ->and($subscription->source)
        ->toBe(NewsletterSubscription::HOMEPAGE_SOURCE);

    Mail::assertQueued(
        ConfirmNewsletterSubscriptionMail::class,
        fn (ConfirmNewsletterSubscriptionMail $mail): bool => $mail->hasTo(
            'visitor@example.com',
        ),
    );
});

test('a visitor can confirm the newsletter subscription using the emailed link', function () {
    Mail::fake();

    $this->postJson(route('newsletter-subscriptions.store'), [
        'email' => 'visitor@example.com',
        'privacy_consent' => true,
    ])->assertOk();

    $confirmationMail = null;

    Mail::assertQueued(
        ConfirmNewsletterSubscriptionMail::class,
        function (ConfirmNewsletterSubscriptionMail $mail) use (&$confirmationMail): bool {
            $confirmationMail = $mail;

            return true;
        },
    );

    expect($confirmationMail)->toBeInstanceOf(
        ConfirmNewsletterSubscriptionMail::class,
    );

    $this->get($confirmationMail->confirmationUrl)
        ->assertRedirect(route('home', ['newsletter' => 'confirmed']).'#newsletter');

    $subscription = NewsletterSubscription::query()->sole();

    expect($subscription->status)
        ->toBe(NewsletterSubscriptionStatus::Confirmed)
        ->and($subscription->confirmed_at)
        ->not->toBeNull()
        ->and($subscription->confirmation_token_hash)
        ->toBeNull();
});

test('a subscriber can unsubscribe using the signed email link', function () {
    $subscription = NewsletterSubscription::factory()->create();
    $unsubscribeUrl = URL::signedRoute(
        'newsletter-subscriptions.unsubscribe',
        ['newsletterSubscription' => $subscription],
    );

    $this->get($unsubscribeUrl)
        ->assertRedirect(
            route('home', ['newsletter' => 'unsubscribed']).'#newsletter',
        );

    expect($subscription->refresh()->status)
        ->toBe(NewsletterSubscriptionStatus::Unsubscribed)
        ->and($subscription->unsubscribed_at)
        ->not->toBeNull();
});

test('email providers can unsubscribe a subscriber with one click', function () {
    $subscription = NewsletterSubscription::factory()->create();
    $unsubscribeUrl = URL::signedRoute(
        'newsletter-subscriptions.unsubscribe',
        ['newsletterSubscription' => $subscription],
    );

    $this->post($unsubscribeUrl, [
        'List-Unsubscribe' => 'One-Click',
    ])->assertNoContent();

    expect($subscription->refresh()->status)
        ->toBe(NewsletterSubscriptionStatus::Unsubscribed);
});

test('newsletter unsubscribe links require a valid signature', function () {
    $subscription = NewsletterSubscription::factory()->create();

    $this->get(route('newsletter-subscriptions.unsubscribe', [
        'newsletterSubscription' => $subscription,
    ]))->assertNotFound();

    expect($subscription->refresh()->status)
        ->toBe(NewsletterSubscriptionStatus::Confirmed);
});

test('newsletter emails include a visible and one-click unsubscribe option', function () {
    $subscription = NewsletterSubscription::factory()->pending()->create();
    $mail = new ConfirmNewsletterSubscriptionMail(
        $subscription,
        'confirmation-token',
    );

    expect($mail->unsubscribeUrl)
        ->toContain(
            route('newsletter-subscriptions.unsubscribe', [
                'newsletterSubscription' => $subscription,
            ]),
        )
        ->and($mail->headers()->text)
        ->toMatchArray([
            'List-Unsubscribe' => '<'.$mail->unsubscribeUrl.'>',
            'List-Unsubscribe-Post' => 'List-Unsubscribe=One-Click',
        ]);

    $mail->assertSeeInHtml('cancelar este pedido');
    $mail->assertSeeInText('cancelar este pedido');
});

test('authenticated customers can stop marketing emails from preferences', function () {
    $customer = User::factory()->create();
    $subscription = NewsletterSubscription::factory()->create([
        'email' => $customer->email,
    ]);

    $this->actingAs($customer)
        ->delete(route('account.preferences.marketing.destroy'))
        ->assertRedirect(route('account.preferences.edit'));

    expect($subscription->refresh()->status)
        ->toBe(NewsletterSubscriptionStatus::Unsubscribed)
        ->and($subscription->unsubscribed_at)
        ->not->toBeNull();

    $this->get(route('account.preferences.edit'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->where('preferences.marketing.status', 'not-authorized')
                ->where('preferences.marketing.isAuthorized', false),
        );
});

test('newsletter confirmation requires a valid single-use token', function () {
    $subscription = NewsletterSubscription::factory()->pending()->create();
    $url = URL::temporarySignedRoute(
        'newsletter-subscriptions.confirm',
        now()->addHour(),
        [
            'newsletterSubscription' => $subscription,
            'token' => 'invalid-token',
        ],
    );

    $this->get($url)->assertNotFound();

    expect($subscription->refresh()->status)
        ->toBe(NewsletterSubscriptionStatus::Pending);
});

test('a newsletter subscription requires a valid email and consent', function () {
    $response = $this->postJson(route('newsletter-subscriptions.store'), [
        'email' => 'invalid-email',
    ]);

    $response
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['email', 'privacy_consent']);
});

test('the newsletter honeypot rejects automated submissions', function () {
    Mail::fake();

    $this->postJson(route('newsletter-subscriptions.store'), [
        'email' => 'visitor@example.com',
        'privacy_consent' => true,
        'website' => 'https://spam.example',
    ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('website');

    expect(NewsletterSubscription::query()->count())->toBe(0);
    Mail::assertNothingQueued();
});

test('repeated pending subscriptions respect the email cooldown', function () {
    Mail::fake();

    $payload = [
        'email' => 'visitor@example.com',
        'privacy_consent' => true,
    ];

    $this->postJson(route('newsletter-subscriptions.store'), $payload)
        ->assertOk();
    $originalTokenHash = NewsletterSubscription::query()
        ->sole()
        ->confirmation_token_hash;

    $this->postJson(route('newsletter-subscriptions.store'), $payload)
        ->assertOk();

    expect(NewsletterSubscription::query()->count())
        ->toBe(1)
        ->and(NewsletterSubscription::query()->sole()->confirmation_token_hash)
        ->toBe($originalTokenHash);
    Mail::assertQueued(ConfirmNewsletterSubscriptionMail::class, 1);
});

test('a new confirmation email can be requested after the cooldown', function () {
    Mail::fake();

    $payload = [
        'email' => 'visitor@example.com',
        'privacy_consent' => true,
    ];

    $this->postJson(route('newsletter-subscriptions.store'), $payload)
        ->assertOk();
    $originalTokenHash = NewsletterSubscription::query()
        ->sole()
        ->confirmation_token_hash;

    $this->travel(
        (int) config('newsletter.confirmation_resend_cooldown_minutes') + 1,
    )->minutes();

    $this->postJson(route('newsletter-subscriptions.store'), $payload)
        ->assertOk();

    expect(NewsletterSubscription::query()->sole()->confirmation_token_hash)
        ->not->toBe($originalTokenHash);
    Mail::assertQueued(ConfirmNewsletterSubscriptionMail::class, 2);
});

test('an already confirmed address receives the same neutral response without another email', function () {
    Mail::fake();
    NewsletterSubscription::factory()->create([
        'email' => 'visitor@example.com',
    ]);

    $this->postJson(route('newsletter-subscriptions.store'), [
        'email' => 'visitor@example.com',
        'privacy_consent' => true,
    ])->assertOk()->assertExactJson([
        'message' => 'Se o endereço puder ser subscrito, receberás um email para confirmar a inscrição.',
        'masked_email' => 'v******@example.com',
        'expiration_minutes' => 60,
    ]);

    expect(NewsletterSubscription::query()->count())->toBe(1);
    Mail::assertNothingQueued();
});

test('newsletter requests are rate limited by IP address', function () {
    Mail::fake();

    foreach (range(1, 3) as $attempt) {
        $this->postJson(route('newsletter-subscriptions.store'), [
            'email' => "visitor{$attempt}@example.com",
            'privacy_consent' => true,
        ])->assertOk();
    }

    $this->postJson(route('newsletter-subscriptions.store'), [
        'email' => 'blocked@example.com',
        'privacy_consent' => true,
    ])->assertTooManyRequests();
});

test('old pending newsletter subscriptions are pruned automatically', function () {
    $expiredPendingSubscription = NewsletterSubscription::factory()
        ->pending()
        ->create([
            'confirmation_sent_at' => now()->subDays(
                (int) config('newsletter.pending_retention_days') + 1,
            ),
        ]);
    $recentPendingSubscription = NewsletterSubscription::factory()
        ->pending()
        ->create();
    $confirmedSubscription = NewsletterSubscription::factory()->create([
        'confirmation_sent_at' => now()->subMonth(),
    ]);

    $this->artisan('model:prune', [
        '--model' => [NewsletterSubscription::class],
    ])->assertSuccessful();

    $this->assertModelMissing($expiredPendingSubscription);
    $this->assertModelExists($recentPendingSubscription);
    $this->assertModelExists($confirmedSubscription);
});
