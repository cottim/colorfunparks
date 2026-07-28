<?php

use App\Mail\ConfirmNewsletterSubscriptionMail;
use App\Models\NewsletterSubscription;
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
            ->has('bookingOptions.partyTimes', 16)
            ->where('initialProgramSelection', null),
    );
});

test('the homepage receives the configurable party programs and badges', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('welcome')
                ->has('partyPrograms', 3)
                ->where('partyPrograms.0.value', 'color')
                ->where('partyPrograms.0.choiceGroups.0.value', 'snack')
                ->where(
                    'partyPrograms.0.choiceGroups.0.prompt',
                    'Escolhe o acompanhamento',
                )
                ->has('partyPrograms.1.choiceGroups', 1)
                ->where(
                    'partyPrograms.1.choiceGroups.0.value',
                    'dessert',
                )
                ->where(
                    'partyPrograms.1.includes.6',
                    'Água, sumo 100% ou néctar',
                )
                ->has('partyProgramBadges', 2)
                ->where('partyProgramBadges.0.programValue', 'color')
                ->where('partyProgramBadges.0.text', 'Mais escolhido')
                ->where('partyProgramBadges.1.programValue', 'balance')
                ->where('partyProgramBadges.1.text', 'Saudável')
                ->has('sharedPartyProgramIncludes', 4)
                ->where(
                    'sharedPartyProgramIncludes.0',
                    'Convites em papel ou digitais',
                )
                ->has('partyProgramConditions', 4),
        );
});

test('the mobile party program carousel keeps an inset and centers selected cards', function () {
    $component = file_get_contents(
        resource_path('js/components/home/party-programs-section.tsx'),
    );

    expect($component)
        ->toContain('scroll-px-1', 'px-1', 'snap-center')
        ->toContain("inline: 'center'")
        ->toContain("behavior: reduceMotion ? 'auto' : 'smooth'")
        ->toContain('animate={{ opacity: 1, y: 0 }}');
});

test('the homepage shares the account state used by its customer access', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page->where('auth.user', null),
        );

    $customer = User::factory()->create();

    $this->actingAs($customer)
        ->get(route('home'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->where('auth.user.id', $customer->id)
                ->where('auth.user.role', 'customer'),
        );

    $staff = User::factory()->staff()->create();

    $this->actingAs($staff)
        ->get(route('home'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->where('auth.user.id', $staff->id)
                ->where('auth.user.role', 'staff'),
        );
});

test('a homepage menu selection pre-fills the booking form', function () {
    $this->get(route('party-bookings.create', [
        'program' => 'color',
        'choices' => [
            'snack' => 'popcorn',
            'dessert' => 'ice-cream',
            'unexpected' => 'ignored',
        ],
    ]))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->where('initialProgramSelection.programValue', 'color')
                ->where('initialProgramSelection.choices.snack', 'popcorn')
                ->where('initialProgramSelection.choices.dessert', 'ice-cream')
                ->missing('initialProgramSelection.choices.unexpected'),
        );
});

test('an invalid homepage program is not pre-selected', function () {
    $this->get(route('party-bookings.create', [
        'program' => 'invented-program',
        'choices' => ['snack' => 'popcorn'],
    ]))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->where('initialProgramSelection', null),
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
        ->toBe('Menu Color')
        ->and($booking->program_choices)
        ->toBe([
            'snack' => [
                'group' => 'Acompanhamento',
                'value' => 'fries',
                'label' => 'Batatas fritas',
            ],
            'dessert' => [
                'group' => 'Sobremesa',
                'value' => 'gelatin',
                'label' => 'Gelatina',
            ],
        ])
        ->and($booking->privacy_accepted_at)
        ->not->toBeNull()
        ->and($booking->terms_accepted_at)
        ->not->toBeNull();
});

test('authenticated customers are redirected to the newly created booking', function () {
    $customer = User::factory()->withLegalConsent()->create([
        'name' => 'Cliente Real',
        'email' => 'real@example.com',
    ]);

    $this->actingAs($customer)
        ->get(route('party-bookings.create'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page->where(
                'authenticatedCustomer',
                [
                    'name' => 'Cliente Real',
                    'email' => 'real@example.com',
                    'hasAcceptedLegalConsent' => true,
                    'marketing' => [
                        'status' => 'not-authorized',
                        'label' => 'Não autorizado',
                        'isAuthorized' => false,
                    ],
                ],
            ),
        );

    $response = $this->actingAs($customer)->post(
        route('party-bookings.store'),
        validPartyBookingPayload([
            'contact_name' => 'Nome adulterado',
            'email' => 'adulterado@example.com',
            'privacy_accepted' => false,
            'terms_accepted' => false,
            'marketing_accepted' => true,
        ]),
    );

    $booking = PartyBooking::query()->sole();

    $response->assertRedirect(
        route('account.bookings.show', $booking),
    );

    expect($booking->user_id)
        ->toBe($customer->id)
        ->and($booking->contact_name)
        ->toBe('Cliente Real')
        ->and($booking->contact_email)
        ->toBe('real@example.com')
        ->and(NewsletterSubscription::query()->count())
        ->toBe(0);
});

test('authenticated customers do not need to submit name or email', function () {
    $customer = User::factory()->create([
        'name' => 'Cliente Real',
        'email' => 'real@example.com',
    ]);

    $this->actingAs($customer)
        ->post(
            route('party-bookings.store'),
            validPartyBookingPayload([
                'contact_name' => '',
                'email' => '',
                'phone' => '',
            ]),
        )
        ->assertRedirect();

    $booking = PartyBooking::query()->sole();

    expect($booking->contact_name)
        ->toBe('Cliente Real')
        ->and($booking->contact_email)
        ->toBe('real@example.com')
        ->and($customer->refresh()->hasAcceptedCurrentLegalConsent())
        ->toBeTrue();
});

test('authenticated customers with account consent may omit booking consent fields', function () {
    $customer = User::factory()->withLegalConsent()->create();
    $payload = validPartyBookingPayload();
    unset(
        $payload['privacy_accepted'],
        $payload['terms_accepted'],
        $payload['marketing_accepted'],
    );

    $this->actingAs($customer)
        ->post(route('party-bookings.store'), $payload)
        ->assertRedirect();

    expect(PartyBooking::query()->count())->toBe(1);
});

test('customers can leave the booking flow to use another account', function () {
    $customer = User::factory()->create();

    $this->actingAs($customer)
        ->post(route('party-bookings.customer-session.destroy'))
        ->assertRedirect(route('login'))
        ->assertSessionHas(
            'url.intended',
            route('party-bookings.create'),
        );

    $this->assertGuest();
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
            'program_choices' => ['invented' => 'choice'],
        ]),
    )->assertSessionHasErrors([
        'park',
        'party_date',
        'party_time',
        'guests',
        'program',
        'program_choices',
    ]);

    expect(PartyBooking::query()->count())->toBe(0);
});

test('menu choices must belong to the selected program', function () {
    $this->post(
        route('party-bookings.store'),
        validPartyBookingPayload([
            'program_choices' => [
                'snack' => 'invented-snack',
                'dessert' => 'gelatin',
                'main' => 'pizza',
            ],
        ]),
    )->assertSessionHasErrors([
        'program_choices',
        'program_choices.snack',
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
        'program' => 'color',
        'program_choices' => [
            'snack' => 'fries',
            'dessert' => 'gelatin',
        ],
        'website' => '',
        ...$overrides,
    ];
}
