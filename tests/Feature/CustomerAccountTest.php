<?php

use App\Models\PartyBooking;
use App\Models\User;
use App\PartyBookingStatus;
use Inertia\Testing\AssertableInertia as Assert;

test('the customer account layout has useful public and profile links', function () {
    $layout = file_get_contents(
        resource_path('js/layouts/customer-account-layout.tsx'),
    );
    $profile = file_get_contents(
        resource_path('js/pages/account/profile.tsx'),
    );

    expect($layout)
        ->toContain(
            '<Link href={home()} aria-label="Voltar ao site">',
        )
        ->toContain(
            'const customerName = props.auth.user.name.trim();',
        )
        ->toContain('Adicionar nome')
        ->toContain('href={account.profile.edit()}')
        ->not->toContain(
            '<Link href={account.index()} aria-label="Ir para a conta">',
        );

    expect($profile)->not->toContain(
        'o email de acesso não pode ser alterado',
    );
});

test('guests are redirected to login from customer account pages', function (string $routeName) {
    $this->get(route($routeName))->assertRedirect(route('login'));
})->with([
    'overview' => 'account.index',
    'bookings' => 'account.bookings.index',
    'profile' => 'account.profile.edit',
    'preferences' => 'account.preferences.edit',
]);

test('staff cannot access customer account pages', function () {
    $staff = User::factory()->staff()->create();

    $this->actingAs($staff)
        ->get(route('account.index'))
        ->assertNotFound();
});

test('customers only see their own open and recent bookings', function () {
    $customer = User::factory()->create();
    $otherCustomer = User::factory()->create();

    $pendingBooking = PartyBooking::factory()
        ->recycle($customer)
        ->create([
            'child_name' => 'Leonor',
            'status' => PartyBookingStatus::Pending,
            'party_date' => '2026-08-20',
            'created_at' => now()->subDays(2),
        ]);
    $contactedBooking = PartyBooking::factory()
        ->recycle($customer)
        ->create([
            'child_name' => 'Tomás',
            'status' => PartyBookingStatus::Contacted,
            'party_date' => '2026-08-10',
            'created_at' => now()->subDay(),
        ]);
    $cancelledBooking = PartyBooking::factory()
        ->recycle($customer)
        ->create([
            'child_name' => 'Marta',
            'status' => PartyBookingStatus::Cancelled,
            'created_at' => now(),
        ]);
    PartyBooking::factory()
        ->recycle($otherCustomer)
        ->create(['child_name' => 'Outra criança']);

    $this->actingAs($customer)
        ->get(route('account.index'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('account/index')
                ->has('openBookings', 2)
                ->where('openBookings.0.id', $contactedBooking->id)
                ->where('openBookings.0.childName', 'Tomás')
                ->where('openBookings.0.statusLabel', 'Contactado')
                ->where('openBookings.1.id', $pendingBooking->id)
                ->has('recentBookings', 3)
                ->where('recentBookings.0.id', $cancelledBooking->id)
                ->where('recentBookings.0.status', 'cancelled')
                ->where('recentBookings.1.id', $contactedBooking->id)
                ->where('recentBookings.2.id', $pendingBooking->id),
        );
});

test('the customer overview has useful empty states', function () {
    $customer = User::factory()->create();

    $this->actingAs($customer)
        ->get(route('account.index'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('account/index')
                ->has('openBookings', 0)
                ->has('recentBookings', 0),
        );
});

test('customers can update only their name from their account', function () {
    $customer = User::factory()->create([
        'name' => 'Nome Antigo',
        'email' => 'cliente@example.com',
    ]);

    $this->actingAs($customer)
        ->patch(route('account.profile.update'), [
            'name' => 'Nome Atualizado',
            'email' => 'adulterado@example.com',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('account.profile.edit'));

    $customer->refresh();

    expect($customer->name)
        ->toBe('Nome Atualizado')
        ->and($customer->email)
        ->toBe('cliente@example.com');
});

test('a customer name is required', function () {
    $customer = User::factory()->create([
        'name' => 'Nome Original',
    ]);

    $this->actingAs($customer)
        ->from(route('account.profile.edit'))
        ->patch(route('account.profile.update'), ['name' => ''])
        ->assertSessionHasErrors('name')
        ->assertRedirect(route('account.profile.edit'));

    expect($customer->fresh()->name)->toBe('Nome Original');
});

test('customers can browse a paginated history containing only their bookings', function () {
    $customer = User::factory()->create();
    $otherCustomer = User::factory()->create();

    PartyBooking::factory()
        ->count(10)
        ->recycle($customer)
        ->create(['created_at' => now()->subDay()]);
    $latestBooking = PartyBooking::factory()
        ->recycle($customer)
        ->create([
            'child_name' => 'Leonor',
            'created_at' => now(),
        ]);
    PartyBooking::factory()
        ->recycle($otherCustomer)
        ->create([
            'child_name' => 'Outra criança',
            'created_at' => now()->addMinute(),
        ]);

    $this->actingAs($customer)
        ->get(route('account.bookings.index'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('account/bookings')
                ->where('bookings.total', 11)
                ->where('bookings.per_page', 10)
                ->has('bookings.data', 10)
                ->where('bookings.data.0.id', $latestBooking->id)
                ->where('bookings.data.0.childName', 'Leonor'),
        );
});

test('customers can view the details of one of their bookings', function () {
    $customer = User::factory()->create();
    $booking = PartyBooking::factory()
        ->recycle($customer)
        ->create([
            'child_name' => 'Leonor',
            'child_age' => 8,
            'contact_phone' => '912 345 678',
            'status' => PartyBookingStatus::Confirmed,
        ]);

    $this->actingAs($customer)
        ->get(route('account.bookings.show', $booking))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('account/booking')
                ->where('booking.id', $booking->id)
                ->where('booking.reference', $booking->reference())
                ->where('booking.childName', 'Leonor')
                ->where('booking.childAge', 8)
                ->where('booking.contactPhone', '912 345 678')
                ->where('booking.status', 'confirmed')
                ->where('booking.statusLabel', 'Confirmado'),
        );
});

test('customers cannot view another customers booking', function () {
    $customer = User::factory()->create();
    $otherCustomer = User::factory()->create();
    $booking = PartyBooking::factory()
        ->recycle($otherCustomer)
        ->create();

    $this->actingAs($customer)
        ->get(route('account.bookings.show', $booking))
        ->assertNotFound();
});

test('customer account section pages are available', function (
    string $routeName,
    string $component,
) {
    $customer = User::factory()->create();

    $this->actingAs($customer)
        ->get(route($routeName))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page->component($component),
        );
})->with([
    'bookings' => ['account.bookings.index', 'account/bookings'],
    'profile' => ['account.profile.edit', 'account/profile'],
    'preferences' => ['account.preferences.edit', 'account/preferences'],
]);
