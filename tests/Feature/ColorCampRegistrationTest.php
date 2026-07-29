<?php

use App\Actions\Customer\ClaimCustomerColorCampRegistrations;
use App\ColorCampRegistrationStatus;
use App\Models\ColorCampRegistration;
use App\Models\User;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

test('participant helper text is rendered below its input', function () {
    $pageSource = file_get_contents(
        resource_path('js/pages/color-camp-registrations/create.tsx'),
    );
    $textFieldSource = Str::after($pageSource, 'function TextField(');

    expect(Str::position($textFieldSource, '<Input'))
        ->toBeLessThan(
            Str::position($textFieldSource, '{description && ('),
        )
        ->and($textFieldSource)
        ->toContain('description ? `${id}-description` : null');
});

test('the Color Camp registration form is public', function () {
    $this->get(route('color-camp-registrations.create'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('color-camp-registrations/create')
                ->where('authenticatedCustomer', null)
                ->where('registrationOptions.season', 'Verão 2026')
                ->has('registrationOptions.weeks', 4)
                ->where(
                    'registrationOptions.weeks.0.available',
                    false,
                )
                ->has('registrationOptions.days', 20),
        );
});

test('authenticated customers are identified by the server in the form', function () {
    $customer = User::factory()->create([
        'name' => 'Maria Cliente',
        'email' => 'maria@example.com',
    ]);

    $this->actingAs($customer)
        ->get(route('color-camp-registrations.create'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->where(
                    'authenticatedCustomer',
                    [
                        'name' => 'Maria Cliente',
                        'email' => 'maria@example.com',
                    ],
                ),
        );
});

test('guests can submit a Color Camp registration', function () {
    $this->withoutExceptionHandling();

    $this->post(
        route('color-camp-registrations.store'),
        validColorCampRegistrationPayload(),
    )->assertRedirect(route('color-camp-registrations.received'));

    $registration = ColorCampRegistration::query()->sole();

    expect($registration->user_id)
        ->toBeNull()
        ->and($registration->contact_name)
        ->toBe('Maria Cliente')
        ->and($registration->contact_email)
        ->toBe('maria@example.com')
        ->and($registration->child_name)
        ->toBe('Leonor')
        ->and($registration->selected_weeks)
        ->toBe(['orange'])
        ->and($registration->allergies_and_health_notes)
        ->toBe('Sem alergias conhecidas.')
        ->and($registration->getRawOriginal('allergies_and_health_notes'))
        ->not->toContain('Sem alergias conhecidas.')
        ->and($registration->status)
        ->toBe(ColorCampRegistrationStatus::Pending);
});

test('authenticated customer identity is derived on the server', function () {
    $customer = User::factory()->create([
        'name' => 'Cliente Real',
        'email' => 'real@example.com',
    ]);

    $response = $this->actingAs($customer)->post(
        route('color-camp-registrations.store'),
        validColorCampRegistrationPayload([
            'contact_name' => 'Nome adulterado',
            'email' => 'adulterado@example.com',
        ]),
    );

    $registration = ColorCampRegistration::query()->sole();

    $response->assertRedirect(
        route(
            'account.color-camp-registrations.show',
            $registration,
        ),
    );

    expect($registration->user_id)
        ->toBe($customer->id)
        ->and($registration->contact_name)
        ->toBe('Cliente Real')
        ->and($registration->contact_email)
        ->toBe('real@example.com');
});

test('Color Camp rules are validated again by the server', function () {
    $this->post(
        route('color-camp-registrations.store'),
        validColorCampRegistrationPayload([
            'child_birth_date' => '2025-01-01',
            'selected_weeks' => ['pink'],
            'lunch_option' => 'invented',
            'photo_consent' => 'invented',
        ]),
    )->assertSessionHasErrors([
        'child_birth_date',
        'selected_weeks.0',
        'lunch_option',
        'photo_consent',
    ]);

    expect(ColorCampRegistration::query()->count())->toBe(0);
});

test('verified customers can claim earlier Color Camp registrations', function () {
    $customer = User::factory()->create([
        'email' => 'maria@example.com',
    ]);
    $registration = ColorCampRegistration::factory()->create([
        'user_id' => null,
        'contact_name' => 'Maria',
        'contact_email' => 'maria@example.com',
    ]);

    $claimed = app(ClaimCustomerColorCampRegistrations::class)
        ->handle($customer);

    expect($claimed)
        ->toBe(1)
        ->and($registration->fresh()->user_id)
        ->toBe($customer->id);
});

test('unverified customers cannot claim Color Camp registrations', function () {
    $customer = User::factory()->unverified()->create([
        'email' => 'maria@example.com',
    ]);
    $registration = ColorCampRegistration::factory()->create([
        'user_id' => null,
        'contact_name' => 'Maria',
        'contact_email' => 'maria@example.com',
    ]);

    $claimed = app(ClaimCustomerColorCampRegistrations::class)
        ->handle($customer);

    expect($claimed)
        ->toBe(0)
        ->and($registration->fresh()->user_id)
        ->toBeNull();
});

test('customers only see their own Color Camp registrations', function () {
    $customer = User::factory()->create();
    $otherCustomer = User::factory()->create();
    $registration = ColorCampRegistration::factory()
        ->recycle($customer)
        ->create(['child_name' => 'Leonor']);
    ColorCampRegistration::factory()
        ->recycle($otherCustomer)
        ->create(['child_name' => 'Outra criança']);

    $this->actingAs($customer)
        ->get(route('account.color-camp-registrations.index'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('account/color-camp-registrations/index')
                ->where('registrations.total', 1)
                ->where(
                    'registrations.data.0.id',
                    $registration->id,
                )
                ->where(
                    'registrations.data.0.childName',
                    'Leonor',
                ),
        );

    $this->actingAs($customer)
        ->get(
            route(
                'account.color-camp-registrations.show',
                $registration,
            ),
        )
        ->assertOk();

    $otherRegistration = ColorCampRegistration::factory()
        ->recycle($otherCustomer)
        ->create();

    $this->actingAs($customer)
        ->get(
            route(
                'account.color-camp-registrations.show',
                $otherRegistration,
            ),
        )
        ->assertNotFound();
});

test('staff can manage Color Camp registrations', function () {
    $staff = User::factory()->staff()->create();
    $registration = ColorCampRegistration::factory()->create([
        'child_name' => 'Leonor',
    ]);

    $this->actingAs($staff)
        ->get(route('management.color-camp-registrations.index'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('management/color-camp-registrations/index')
                ->where('registrations.total', 1)
                ->where(
                    'registrations.data.0.reference',
                    $registration->reference(),
                ),
        );

    $this->actingAs($staff)
        ->patch(
            route(
                'management.color-camp-registrations.update',
                $registration,
            ),
            ['status' => ColorCampRegistrationStatus::Confirmed->value],
        )
        ->assertRedirect();

    expect($registration->fresh()->status)
        ->toBe(ColorCampRegistrationStatus::Confirmed);
});

/**
 * @param  array<string, mixed>  $overrides
 * @return array<string, mixed>
 */
function validColorCampRegistrationPayload(array $overrides = []): array
{
    return [
        'contact_name' => 'Maria Cliente',
        'email' => 'maria@example.com',
        'phone' => '912345678',
        'child_name' => 'Leonor',
        'child_birth_date' => '2018-08-10',
        'allergies_and_health_notes' => 'Sem alergias conhecidas.',
        'authorized_pickup_name' => 'Maria Cliente',
        'authorized_pickup_phone' => '912345678',
        'attendance_type' => 'weeks',
        'selected_weeks' => ['orange'],
        'selected_days' => [],
        'lunch_option' => 'park',
        'discount' => null,
        'needs_extended_care' => false,
        'trip_authorized' => true,
        'photo_consent' => 'yes',
        'notes' => null,
        'privacy_accepted' => true,
        'terms_accepted' => true,
        'website' => '',
        ...$overrides,
    ];
}
