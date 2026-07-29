<?php

use App\Models\User;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('staff can visit the dashboard', function () {
    $staff = User::factory()->staff()->create();

    $this->actingAs($staff)
        ->get(route('dashboard'))
        ->assertRedirect(route('management.index'));
});

test('customers use their account instead of the staff dashboard', function () {
    $customer = User::factory()->create();

    $this->actingAs($customer)
        ->get(route('dashboard'))
        ->assertNotFound();

    $this->get(route('account.index'))->assertOk();
});
