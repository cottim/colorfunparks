<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('the internal login page is available to guests', function () {
    $this->get(route('admin.login'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page->component('auth/admin-login'),
        );
});

test('management pages require an internal account', function (string $route) {
    $this->get(route($route))->assertRedirect(route('login'));
})->with([
    'dashboard' => 'management.index',
    'bookings' => 'management.bookings.index',
    'color camp' => 'management.color-camp-registrations.index',
    'customers' => 'management.customers.index',
    'users' => 'management.users.index',
]);

test('customers cannot access management pages', function (string $route) {
    $customer = User::factory()->create();

    $this->actingAs($customer)
        ->get(route($route))
        ->assertForbidden();
})->with([
    'dashboard' => 'management.index',
    'bookings' => 'management.bookings.index',
    'color camp' => 'management.color-camp-registrations.index',
    'customers' => 'management.customers.index',
    'users' => 'management.users.index',
]);

test('staff can access operational pages but not user management', function () {
    $staff = User::factory()->staff()->create();

    $this->actingAs($staff)
        ->get(route('management.index'))
        ->assertOk();
    $this->actingAs($staff)
        ->get(route('management.bookings.index'))
        ->assertOk();
    $this->actingAs($staff)
        ->get(route('management.color-camp-registrations.index'))
        ->assertOk();
    $this->actingAs($staff)
        ->get(route('management.customers.index'))
        ->assertOk();
    $this->actingAs($staff)
        ->get(route('management.users.index'))
        ->assertForbidden();
});

test('administrators can access user management', function () {
    $administrator = User::factory()->admin()->create();

    $this->actingAs($administrator)
        ->get(route('management.users.index'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('management/users/index')
                ->has('users.data', 1)
                ->where('users.data.0.email', $administrator->email)
                ->has('invitations', 0),
        );
});
