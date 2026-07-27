<?php

use App\Mail\StaffInvitationMail;
use App\Models\StaffInvitation;
use App\Models\User;
use App\UserRole;
use Illuminate\Support\Facades\Mail;

test('the first administrator can be bootstrapped by invitation', function () {
    Mail::fake();

    $this->artisan('staff:bootstrap', [
        'email' => 'primeiro.admin@example.com',
    ])
        ->expectsOutputToContain('Convite enviado')
        ->assertSuccessful();

    $invitation = StaffInvitation::query()->sole();

    expect($invitation->invited_by_id)->toBeNull()
        ->and($invitation->role)->toBe(UserRole::Admin)
        ->and($invitation->email)->toBe('primeiro.admin@example.com');

    Mail::assertQueued(
        StaffInvitationMail::class,
        fn (StaffInvitationMail $mail): bool => $mail->hasTo(
            'primeiro.admin@example.com',
        ),
    );
});

test('bootstrap is disabled after an administrator exists', function () {
    Mail::fake();
    User::factory()->admin()->create();

    $this->artisan('staff:bootstrap', [
        'email' => 'segundo.admin@example.com',
    ])
        ->expectsOutputToContain('Já existe um administrador')
        ->assertFailed();

    expect(StaffInvitation::query()->count())->toBe(0);
    Mail::assertNothingQueued();
});

test('bootstrap requires an unused valid email', function () {
    Mail::fake();

    $this->artisan('staff:bootstrap', ['email' => 'email-invalido'])
        ->assertFailed();

    expect(StaffInvitation::query()->count())->toBe(0);
    Mail::assertNothingQueued();
});
