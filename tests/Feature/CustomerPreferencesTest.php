<?php

use App\Mail\ConfirmNewsletterSubscriptionMail;
use App\Models\NewsletterSubscription;
use App\Models\User;
use App\NewsletterSubscriptionStatus;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia as Assert;

test('customers see their current preference states', function () {
    $this->travelTo(now()->setDate(2026, 7, 28)->startOfDay());

    $customer = User::factory()->create();

    $this->actingAs($customer)
        ->get(route('account.preferences.edit'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('account/preferences')
                ->where('preferences.marketing.status', 'not-authorized')
                ->where('preferences.marketing.label', 'Não autorizado')
                ->where('preferences.marketing.isAuthorized', false)
                ->where('preferences.legal.status', 'required')
                ->where(
                    'preferences.legal.label',
                    'Ação necessária',
                )
                ->where(
                    'preferences.legal.privacyAcceptedAt',
                    null,
                )
                ->where(
                    'preferences.legal.termsAcceptedAt',
                    null,
                )
                ->where(
                    'preferences.playCard.status',
                    'promotion-unlocked',
                )
                ->where(
                    'preferences.playCard.label',
                    'Benefícios ativos',
                )
                ->where(
                    'preferences.playCard.benefitsActiveUntil',
                    '2026-08-27',
                )
                ->where(
                    'preferences.playCard.benefitsBasedOn',
                    'account-creation',
                ),
        );
});

test('customers see when their current legal consent was accepted', function () {
    $acceptedAt = now()->setDate(2026, 7, 20)->startOfDay();
    $customer = User::factory()->withLegalConsent()->create([
        'privacy_accepted_at' => $acceptedAt,
        'terms_accepted_at' => $acceptedAt,
    ]);

    $this->actingAs($customer)
        ->get(route('account.preferences.edit'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->where('preferences.legal.status', 'accepted')
                ->where('preferences.legal.label', 'Aceite')
                ->where(
                    'preferences.legal.privacyAcceptedAt',
                    '2026-07-20',
                )
                ->where(
                    'preferences.legal.termsAcceptedAt',
                    '2026-07-20',
                ),
        );
});

test('customers must accept both current legal documents from preferences', function () {
    $customer = User::factory()->create();

    $this->actingAs($customer)
        ->post(route('account.preferences.legal-consent.store'), [
            'privacy_accepted' => true,
        ])
        ->assertSessionHasErrors('terms_accepted');

    expect($customer->refresh()->hasAcceptedCurrentLegalConsent())->toBeFalse();
});

test('customers can accept the current legal documents from preferences', function () {
    $acceptedAt = now()->setDate(2026, 7, 28)->setTime(12, 30);
    $this->travelTo($acceptedAt);

    $customer = User::factory()->create();

    $this->actingAs($customer)
        ->post(route('account.preferences.legal-consent.store'), [
            'privacy_accepted' => true,
            'terms_accepted' => true,
        ])
        ->assertRedirect(route('account.preferences.edit'));

    $customer->refresh();

    expect($customer->hasAcceptedCurrentLegalConsent())
        ->toBeTrue()
        ->and($customer->privacy_accepted_at?->equalTo($acceptedAt))
        ->toBeTrue()
        ->and($customer->terms_accepted_at?->equalTo($acceptedAt))
        ->toBeTrue()
        ->and($customer->legal_consent_version)
        ->toBe(User::LEGAL_CONSENT_VERSION);
});

test('accepting already current legal documents preserves the original audit dates', function () {
    $originalAcceptedAt = now()->setDate(2026, 7, 20)->setTime(10, 0);
    $customer = User::factory()->withLegalConsent()->create([
        'privacy_accepted_at' => $originalAcceptedAt,
        'terms_accepted_at' => $originalAcceptedAt,
    ]);

    $this->travelTo(now()->setDate(2026, 7, 28)->setTime(12, 30));

    $this->actingAs($customer)
        ->post(route('account.preferences.legal-consent.store'), [
            'privacy_accepted' => true,
            'terms_accepted' => true,
        ])
        ->assertRedirect(route('account.preferences.edit'));

    $customer->refresh();

    expect($customer->privacy_accepted_at?->equalTo($originalAcceptedAt))
        ->toBeTrue()
        ->and($customer->terms_accepted_at?->equalTo($originalAcceptedAt))
        ->toBeTrue();
});

test('confirmed and pending marketing preferences are distinguished', function (
    NewsletterSubscriptionStatus $status,
    string $expectedStatus,
) {
    $customer = User::factory()->create();

    NewsletterSubscription::factory()
        ->when(
            $status === NewsletterSubscriptionStatus::Pending,
            fn ($factory) => $factory->pending(),
        )
        ->create([
            'email' => $customer->email,
            'status' => $status,
        ]);

    $this->actingAs($customer)
        ->get(route('account.preferences.edit'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page->where(
                'preferences.marketing.status',
                $expectedStatus,
            ),
        );
})->with([
    'confirmed' => [
        NewsletterSubscriptionStatus::Confirmed,
        'authorized',
    ],
    'pending' => [
        NewsletterSubscriptionStatus::Pending,
        'pending',
    ],
]);

test('customers can request marketing emails from their preferences', function () {
    Mail::fake();

    $customer = User::factory()->create([
        'email' => 'cliente@example.com',
    ]);

    $this->actingAs($customer)
        ->post(route('account.preferences.marketing.store'))
        ->assertRedirect(route('account.preferences.edit'));

    $subscription = NewsletterSubscription::query()->sole();

    expect($subscription->email)
        ->toBe($customer->email)
        ->and($subscription->status)
        ->toBe(NewsletterSubscriptionStatus::Pending)
        ->and($subscription->source)
        ->toBe(NewsletterSubscription::CUSTOMER_ACCOUNT_SOURCE);

    Mail::assertQueued(
        ConfirmNewsletterSubscriptionMail::class,
        fn (ConfirmNewsletterSubscriptionMail $mail): bool => $mail->hasTo(
            $customer->email,
        ),
    );
});

test('customer accounts automatically include a play card membership', function () {
    $customer = User::factory()->create();
    $staff = User::factory()->staff()->create();

    expect($customer->playCardMembership()->count())
        ->toBe(1)
        ->and(
            $customer->playCardMembership()
                ->sole()
                ->joined_at
                ->toDateTimeString(),
        )
        ->toBe($customer->created_at->toDateTimeString())
        ->and($staff->playCardMembership()->doesntExist())
        ->toBeTrue();
});

test('play card benefits remain active for 30 days after joining or using it', function (
    string $joinedAt,
    ?string $lastUsedAt,
    string $expectedStatus,
    string $benefitsActiveUntil,
    string $benefitsBasedOn,
) {
    $this->travelTo(now()->setDate(2026, 7, 28)->startOfDay());

    $customer = User::factory()->create();

    $customer->playCardMembership()->update([
        'joined_at' => $joinedAt,
        'last_used_at' => $lastUsedAt,
    ]);

    $this->actingAs($customer)
        ->get(route('account.preferences.edit'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->where(
                    'preferences.playCard.status',
                    $expectedStatus,
                )
                ->where(
                    'preferences.playCard.benefitsActiveUntil',
                    $benefitsActiveUntil,
                )
                ->where(
                    'preferences.playCard.benefitsBasedOn',
                    $benefitsBasedOn,
                ),
        );
})->with([
    'account created within the last 30 days' => [
        '2026-07-01 00:00:00',
        null,
        'promotion-unlocked',
        '2026-07-31',
        'account-creation',
    ],
    'account created exactly 30 days ago' => [
        '2026-06-28 00:00:00',
        null,
        'promotion-unlocked',
        '2026-07-28',
        'account-creation',
    ],
    'account created more than 30 days ago' => [
        '2026-06-27 00:00:00',
        null,
        'active',
        '2026-07-27',
        'account-creation',
    ],
    'card used within the last 30 days' => [
        '2026-01-01 00:00:00',
        '2026-07-10 00:00:00',
        'promotion-unlocked',
        '2026-08-09',
        'last-use',
    ],
    'card last used more than 30 days ago' => [
        '2026-01-01 00:00:00',
        '2026-06-27 00:00:00',
        'active',
        '2026-07-27',
        'last-use',
    ],
]);

test('customers can see when their play card is inactive', function () {
    $customer = User::factory()->create();
    $customer->playCardMembership()->update([
        'deactivated_at' => now(),
    ]);

    $this->actingAs($customer)
        ->get(route('account.preferences.edit'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->where('preferences.playCard.status', 'inactive')
                ->where('preferences.playCard.label', 'Inativo'),
        );
});
