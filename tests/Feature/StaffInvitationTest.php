<?php

use App\Mail\StaffInvitationMail;
use App\Models\StaffInvitation;
use App\Models\User;
use App\UserRole;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia as Assert;

test('only administrators can send staff invitations', function () {
    Mail::fake();
    $staff = User::factory()->staff()->create();

    $this->actingAs($staff)
        ->post(route('management.users.store'), [
            'email' => 'novo.staff@example.com',
            'role' => UserRole::Staff->value,
        ])
        ->assertForbidden();

    expect(StaffInvitation::query()->count())->toBe(0);
    Mail::assertNothingQueued();
});

test('an administrator can send a single use invitation', function () {
    Mail::fake();
    $administrator = User::factory()->admin()->create();

    $this->actingAs($administrator)
        ->post(route('management.users.store'), [
            'email' => 'novo.staff@example.com',
            'role' => UserRole::Staff->value,
        ])
        ->assertRedirect();

    $invitation = StaffInvitation::query()->sole();

    expect($invitation->invited_by_id)->toBe($administrator->id)
        ->and($invitation->email)->toBe('novo.staff@example.com')
        ->and($invitation->role)->toBe(UserRole::Staff)
        ->and($invitation->token_hash)->toHaveLength(64)
        ->and($invitation->isAcceptable())->toBeTrue();

    Mail::assertQueued(
        StaffInvitationMail::class,
        fn (StaffInvitationMail $mail): bool => $mail->hasTo(
            'novo.staff@example.com',
        ) && hash('sha256', $mail->token) === $invitation->token_hash,
    );
});

test('an invitation cannot use the email of an existing account', function () {
    Mail::fake();
    $administrator = User::factory()->admin()->create();
    $customer = User::factory()->create();

    $this->actingAs($administrator)
        ->from(route('management.users.index'))
        ->post(route('management.users.store'), [
            'email' => $customer->email,
            'role' => UserRole::Staff->value,
        ])
        ->assertRedirect(route('management.users.index'))
        ->assertSessionHasErrors('email');

    Mail::assertNothingQueued();
});

test('a valid invitation can be viewed and accepted once', function () {
    $token = 'a-secure-test-token';
    $invitation = StaffInvitation::factory()->create([
        'email' => 'convidado@example.com',
        'role' => UserRole::Admin,
        'token_hash' => hash('sha256', $token),
    ]);

    $this->get(route('staff-invitations.show', $token))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('auth/accept-staff-invitation')
                ->where('email', 'convidado@example.com')
                ->where('role', 'Administrador')
                ->where('token', $token),
        );

    $this->post(route('staff-invitations.store', $token), [
        'name' => 'Ana Administradora',
        'password' => 'password-segura',
        'password_confirmation' => 'password-segura',
    ])->assertRedirect(route('management.index'));

    $user = User::query()
        ->where('email', 'convidado@example.com')
        ->sole();

    $this->assertAuthenticatedAs($user);
    expect($user->name)->toBe('Ana Administradora')
        ->and($user->role)->toBe(UserRole::Admin)
        ->and($user->email_verified_at)->not->toBeNull()
        ->and($invitation->refresh()->accepted_at)->not->toBeNull();

    $this->post(route('logout'));
    $this->get(route('staff-invitations.show', $token))->assertGone();
});

test('expired and unknown invitations cannot be used', function () {
    $token = 'expired-test-token';
    StaffInvitation::factory()->expired()->create([
        'token_hash' => hash('sha256', $token),
    ]);

    $this->get(route('staff-invitations.show', $token))->assertGone();
    $this->get(route('staff-invitations.show', 'unknown'))->assertNotFound();
});

test('the invitation email contains the acceptance link', function () {
    $token = 'mail-test-token';
    $invitation = StaffInvitation::factory()->create([
        'email' => 'email.staff@example.com',
        'token_hash' => hash('sha256', $token),
    ]);

    (new StaffInvitationMail($invitation, $token))
        ->assertSeeInHtml('Aceitar convite')
        ->assertSeeInHtml(
            route('staff-invitations.show', ['token' => $token]),
            escape: false,
        );
});
