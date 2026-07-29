<?php

use App\Models\NewsletterSubscription;
use App\Models\PartyBooking;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('party references begin at CFP1001', function () {
    $booking = PartyBooking::factory()->create();

    expect($booking->id)->toBe(1)
        ->and($booking->partyNumber())->toBe(1001)
        ->and($booking->reference())->toBe('CFP1001');
});

test('guests are redirected to login from the management page', function () {
    $this->get(route('management.index'))
        ->assertRedirect(route('login'));
});

test('customers cannot access the management page', function () {
    $customer = User::factory()->create();

    $this->actingAs($customer)
        ->get(route('management.index'))
        ->assertNotFound();
});

test('staff can view the management dashboard', function () {
    $customer = User::factory()->create([
        'name' => 'Maria Cliente',
        'email' => 'maria@example.com',
    ]);
    NewsletterSubscription::factory()->create([
        'email' => $customer->email,
    ]);
    $booking = PartyBooking::factory()
        ->recycle($customer)
        ->create([
            'child_name' => 'Leonor',
            'child_age' => 8,
            'park' => 'Color Party',
        ]);
    $staff = User::factory()->staff()->create();

    $this->actingAs($staff)
        ->get(route('management.index'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('management/dashboard')
                ->where('stats.customers', 1)
                ->where('stats.marketing', 1)
                ->where('stats.pending_bookings', 1)
                ->has('recent_bookings', 1)
                ->where(
                    'recent_bookings.0.reference',
                    $booking->reference(),
                )
                ->where('recent_bookings.0.child_name', 'Leonor'),
        );

    $this->actingAs($staff)
        ->get(route('management.customers.index'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('management/customers/index')
                ->has('customers.data', 1)
                ->where('customers.data.0.email', 'maria@example.com')
                ->where('customers.data.0.marketing.value', 'accepted')
                ->where('customers.data.0.party_bookings_count', 1),
        );

    $this->actingAs($staff)
        ->get(route('management.bookings.index'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('management/bookings/index')
                ->has('party_bookings.data', 1)
                ->where(
                    'party_bookings.data.0.reference',
                    $booking->reference(),
                )
                ->where('party_bookings.data.0.customer.email', 'maria@example.com')
                ->where('party_bookings.data.0.child.name', 'Leonor')
                ->where('party_bookings.data.0.child.age', 8)
                ->where('party_bookings.data.0.park', 'Color Party'),
        );
});

test('staff can open an individual party workspace', function () {
    $customer = User::factory()->create([
        'name' => 'Maria Cliente',
        'email' => 'maria@example.com',
    ]);
    $booking = PartyBooking::factory()
        ->recycle($customer)
        ->create([
            'child_name' => 'Leonor',
            'child_age' => 8,
            'contact_phone' => '912 345 678',
            'program_choices' => [
                'dessert' => [
                    'group' => 'Sobremesa',
                    'value' => 'gelatina',
                    'label' => 'Gelatina',
                ],
            ],
        ]);
    $staff = User::factory()->staff()->create();

    $this->actingAs($staff)
        ->get(route('management.bookings.show', $booking))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('management/bookings/show')
                ->where('party_booking.id', $booking->id)
                ->where('party_booking.reference', $booking->reference())
                ->where('party_booking.customer.name', 'Maria Cliente')
                ->where('party_booking.customer.phone', '912 345 678')
                ->where('party_booking.child.name', 'Leonor')
                ->where('party_booking.child.age', 8)
                ->where('party_booking.archived_at', null)
                ->where(
                    'party_booking.program_choices.dessert.label',
                    'Gelatina',
                )
                ->where('party_booking.total_cents', null)
                ->where('party_booking.payment_status', null)
                ->where('permissions.archive', true)
                ->where('permissions.delete', false),
        );
});

test('staff can archive and restore a party booking', function () {
    $booking = PartyBooking::factory()->create();
    $staff = User::factory()->staff()->create();

    $this->actingAs($staff)
        ->patch(route('management.bookings.archive', $booking))
        ->assertRedirect(route('management.bookings.show', $booking))
        ->assertSessionHas('success', 'A festa foi arquivada.');

    expect($booking->refresh()->archived_at)->not->toBeNull();

    $this->actingAs($staff)
        ->get(route('management.bookings.index'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->where('show_archived', false)
                ->has('party_bookings.data', 0),
        );

    $this->actingAs($staff)
        ->get(route('management.bookings.index', ['arquivadas' => 1]))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->where('show_archived', true)
                ->has('party_bookings.data', 1)
                ->where(
                    'party_bookings.data.0.reference',
                    $booking->reference(),
                ),
        );

    $this->actingAs($staff)
        ->delete(route('management.bookings.unarchive', $booking))
        ->assertRedirect(route('management.bookings.show', $booking))
        ->assertSessionHas(
            'success',
            'A festa voltou à lista de festas ativas.',
        );

    expect($booking->refresh()->archived_at)->toBeNull();
});

test('staff cannot permanently delete a party booking', function () {
    $booking = PartyBooking::factory()->create();
    $staff = User::factory()->staff()->create();

    $this->actingAs($staff)
        ->delete(route('management.bookings.destroy', $booking))
        ->assertForbidden();

    $this->assertModelExists($booking);
});

test('administrators can permanently delete a party booking', function () {
    $booking = PartyBooking::factory()->create();
    $administrator = User::factory()->admin()->create();

    $this->actingAs($administrator)
        ->delete(route('management.bookings.destroy', $booking))
        ->assertRedirect(route('management.bookings.index'))
        ->assertSessionHas(
            'success',
            "A festa {$booking->reference()} foi eliminada.",
        );

    $this->assertModelMissing($booking);
});

test('customers cannot open the management party workspace', function () {
    $customer = User::factory()->create();
    $booking = PartyBooking::factory()->create();

    $this->actingAs($customer)
        ->get(route('management.bookings.show', $booking))
        ->assertNotFound();
});

test('administrators can access the management page', function () {
    $administrator = User::factory()->admin()->create();
    $booking = PartyBooking::factory()->create();

    $this->actingAs($administrator)
        ->get(route('management.index'))
        ->assertOk();

    $this->actingAs($administrator)
        ->get(route('management.bookings.show', $booking))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->where('permissions.archive', true)
                ->where('permissions.delete', true),
        );
});
