<?php

use App\Models\NewsletterSubscription;
use App\Models\PartyBooking;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to login from the management page', function () {
    $this->get(route('management.index'))
        ->assertRedirect(route('login'));
});

test('customers cannot access the management page', function () {
    $customer = User::factory()->create();

    $this->actingAs($customer)
        ->get(route('management.index'))
        ->assertForbidden();
});

test('staff can view the management dashboard', function () {
    $customer = User::factory()->create([
        'name' => 'Maria Cliente',
        'email' => 'maria@example.com',
    ]);
    NewsletterSubscription::factory()->create([
        'email' => $customer->email,
    ]);
    PartyBooking::factory()
        ->recycle($customer)
        ->create([
            'child_name' => 'Leonor',
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
                ->where('party_bookings.data.0.customer.email', 'maria@example.com')
                ->where('party_bookings.data.0.child.name', 'Leonor')
                ->where('party_bookings.data.0.park', 'Color Party'),
        );
});

test('administrators can access the management page', function () {
    $administrator = User::factory()->admin()->create();

    $this->actingAs($administrator)
        ->get(route('management.index'))
        ->assertOk();
});
