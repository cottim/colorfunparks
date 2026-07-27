<?php

use App\Mail\ConfirmNewsletterSubscriptionMail;
use App\Models\PartyBooking;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia as Assert;

test('the party booking page can be displayed', function () {
    $response = $this->get(route('party-bookings.create'));

    $response->assertOk()->assertInertia(
        fn (Assert $page) => $page
            ->component('party-bookings/create')
            ->where('bookingOptions.maxBookingMonthsAhead', 3)
            ->has('bookingOptions.parks', 3)
            ->has('bookingOptions.programs', 3)
            ->has('bookingOptions.partyTimes', 16),
    );
});

test('guests can submit a party booking without attaching it to an account', function () {
    $this->post(
        route('party-bookings.store'),
        validPartyBookingPayload([
            'contact_name' => ' Maria Cliente ',
            'email' => ' MARIA@EXAMPLE.COM ',
        ]),
    )->assertRedirect(route('party-bookings.received'));

    $booking = PartyBooking::query()->sole();

    $this->assertModelExists($booking);

    expect($booking->user_id)
        ->toBeNull()
        ->and($booking->contact_name)
        ->toBe('Maria Cliente')
        ->and($booking->contact_email)
        ->toBe('maria@example.com')
        ->and($booking->park)
        ->toBe('Color Party')
        ->and($booking->program)
        ->toBe('Festa Essencial')
        ->and($booking->privacy_accepted_at)
        ->not->toBeNull()
        ->and($booking->terms_accepted_at)
        ->not->toBeNull();
});

test('authenticated customers are redirected to the newly created booking', function () {
    $customer = User::factory()->create();

    $response = $this->actingAs($customer)->post(
        route('party-bookings.store'),
        validPartyBookingPayload(),
    );

    $booking = PartyBooking::query()->sole();

    $response->assertRedirect(
        route('account.bookings.show', $booking),
    );

    expect($booking->user_id)->toBe($customer->id);
});

test('a phone only party booking remains valid', function () {
    $this->post(
        route('party-bookings.store'),
        validPartyBookingPayload([
            'email' => '',
            'phone' => '+351 912 345 678',
        ]),
    )->assertRedirect(route('party-bookings.received'));

    $booking = PartyBooking::query()->sole();

    expect($booking->contact_email)
        ->toBeNull()
        ->and($booking->contact_phone)
        ->toBe('+351 912 345 678');
});

test('party booking values are validated again by the server', function () {
    $this->post(
        route('party-bookings.store'),
        validPartyBookingPayload([
            'park' => 'invented-park',
            'party_date' => today()->subDay()->toDateString(),
            'party_time' => '23:45',
            'guests' => 500,
            'program' => 'invented-program',
        ]),
    )->assertSessionHasErrors([
        'park',
        'party_date',
        'party_time',
        'guests',
        'program',
    ]);

    expect(PartyBooking::query()->count())->toBe(0);
});

test('marketing consent requires an email address', function () {
    $this->post(
        route('party-bookings.store'),
        validPartyBookingPayload([
            'email' => '',
            'phone' => '912345678',
            'marketing_accepted' => true,
        ]),
    )->assertSessionHasErrors('email');

    expect(PartyBooking::query()->count())->toBe(0);
});

test('marketing consent starts the newsletter confirmation flow', function () {
    Mail::fake();

    $this->post(
        route('party-bookings.store'),
        validPartyBookingPayload([
            'marketing_accepted' => true,
        ]),
    )->assertRedirect(route('party-bookings.received'));

    Mail::assertQueued(
        ConfirmNewsletterSubscriptionMail::class,
        fn (ConfirmNewsletterSubscriptionMail $mail): bool => $mail->hasTo(
            'maria@example.com',
        ),
    );
});

/**
 * @param  array<string, mixed>  $overrides
 * @return array<string, mixed>
 */
function validPartyBookingPayload(array $overrides = []): array
{
    return [
        'contact_name' => 'Maria Cliente',
        'email' => 'maria@example.com',
        'phone' => '912345678',
        'privacy_accepted' => true,
        'terms_accepted' => true,
        'marketing_accepted' => false,
        'park' => 'color-party',
        'child_name' => 'Leonor',
        'child_age' => 8,
        'party_date' => today()->addWeek()->toDateString(),
        'party_time' => '14:30',
        'guests' => 20,
        'program' => 'essential',
        'website' => '',
        ...$overrides,
    ];
}
