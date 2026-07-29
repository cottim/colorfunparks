<?php

use App\Actions\Auth\RevokeUserSessions;
use App\Actions\Customer\ClaimCustomerPartyBookings;
use App\Mail\ConfirmEmailChangeMail;
use App\Mail\CustomerLoginLinkMail;
use App\Models\PartyBooking;
use App\Models\PendingEmailChange;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;

test('requesting an email change requires recent authentication', function () {
    Mail::fake();
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('profile.email.store'), [
            'email' => 'new@example.com',
        ])
        ->assertRedirect(route('password.confirm'));

    expect(PendingEmailChange::query()->count())->toBe(0);
    Mail::assertNothingQueued();
});

test('requesting an email change keeps the current identity unchanged', function () {
    Mail::fake();
    $user = User::factory()->create([
        'email' => 'current@example.com',
    ]);

    $this->actingAs($user)
        ->withSession(['auth.password_confirmed_at' => time()])
        ->post(route('profile.email.store'), [
            'email' => '  NEW@EXAMPLE.COM ',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    $user->refresh();
    $pendingEmailChange = $user->pendingEmailChange;

    expect($user->email)->toBe('current@example.com')
        ->and($user->email_verified_at)->not->toBeNull()
        ->and($pendingEmailChange)->not->toBeNull()
        ->and($pendingEmailChange->email)->toBe('new@example.com');

    Mail::assertQueued(
        ConfirmEmailChangeMail::class,
        fn (ConfirmEmailChangeMail $mail): bool => $mail->hasTo(
            'new@example.com',
        ),
    );
});

test('an expired pending change cannot reserve an email address forever', function () {
    Mail::fake();
    $expiredChange = PendingEmailChange::factory()->create([
        'email' => 'available@example.com',
        'expires_at' => now()->subMinute(),
    ]);
    $user = User::factory()->create();

    $this->actingAs($user)
        ->withSession(['auth.password_confirmed_at' => time()])
        ->post(route('profile.email.store'), [
            'email' => 'available@example.com',
        ])
        ->assertSessionHasNoErrors();

    expect($expiredChange->fresh())->toBeNull()
        ->and($user->pendingEmailChange?->email)
        ->toBe('available@example.com');
});

test('the new address is only applied after its confirmation link is used', function () {
    Mail::fake();
    $user = User::factory()->create([
        'email' => 'current@example.com',
    ]);

    $this->actingAs($user)
        ->withSession(['auth.password_confirmed_at' => time()])
        ->post(route('profile.email.store'), [
            'email' => 'new@example.com',
        ]);

    $confirmationMail = null;

    Mail::assertQueued(
        ConfirmEmailChangeMail::class,
        function (ConfirmEmailChangeMail $mail) use (
            &$confirmationMail,
        ): bool {
            $confirmationMail = $mail;

            return true;
        },
    );

    expect($confirmationMail)->toBeInstanceOf(
        ConfirmEmailChangeMail::class,
    );

    $this->get($confirmationMail->confirmationUrl)
        ->assertRedirect(route('profile.edit'));

    $user->refresh();

    expect($user->email)->toBe('new@example.com')
        ->and($user->email_verified_at)->not->toBeNull()
        ->and($user->pendingEmailChange)->toBeNull();
});

test('an invalid email change token cannot alter the account', function () {
    $user = User::factory()->create([
        'email' => 'current@example.com',
    ]);
    $pendingEmailChange = PendingEmailChange::factory()
        ->recycle($user)
        ->create([
            'email' => 'new@example.com',
            'token_hash' => hash('sha256', 'valid-token'),
        ]);

    $url = URL::temporarySignedRoute(
        'profile.email.confirm',
        now()->addHour(),
        [
            'pendingEmailChange' => $pendingEmailChange,
            'token' => 'invalid-token',
        ],
        absolute: false,
    );

    $this->get($url)->assertNotFound();

    expect($user->refresh()->email)->toBe('current@example.com')
        ->and($pendingEmailChange->fresh())->not->toBeNull();
});

test('unverified customers cannot claim guest party bookings', function () {
    $customer = User::factory()->unverified()->create([
        'email' => 'customer@example.com',
    ]);
    $booking = PartyBooking::factory()->create([
        'user_id' => null,
        'contact_email' => 'customer@example.com',
    ]);

    $claimedBookings = app(ClaimCustomerPartyBookings::class)
        ->handle($customer);

    expect($claimedBookings)->toBe(0)
        ->and($booking->refresh()->user_id)->toBeNull();
});

test('a pending email change prevents the email squatting exploit chain', function () {
    Mail::fake();
    $attacker = User::factory()->create([
        'email' => 'attacker@example.com',
    ]);

    $this->actingAs($attacker)
        ->withSession(['auth.password_confirmed_at' => time()])
        ->post(route('profile.email.store'), [
            'email' => 'victim@example.com',
        ])
        ->assertSessionHasNoErrors();

    $booking = PartyBooking::factory()->create([
        'user_id' => null,
        'contact_email' => 'victim@example.com',
        'child_name' => 'Victim Child',
    ]);

    $this->post(route('logout'))->assertRedirect(route('home'));

    $this->post(route('customer-login.request'), [
        'email' => 'victim@example.com',
        'privacy_accepted' => true,
        'terms_accepted' => true,
    ])->assertRedirect();

    $loginMail = null;

    Mail::assertQueued(
        CustomerLoginLinkMail::class,
        function (CustomerLoginLinkMail $mail) use (&$loginMail): bool {
            $loginMail = $mail;

            return true;
        },
    );

    expect($loginMail)->toBeInstanceOf(CustomerLoginLinkMail::class);

    $this->get($loginMail->loginUrl)
        ->assertRedirect(route('account.index'));

    $victim = User::query()
        ->where('email', 'victim@example.com')
        ->sole();

    expect($attacker->refresh()->email)->toBe('attacker@example.com')
        ->and($victim->id)->not->toBe($attacker->id)
        ->and($booking->refresh()->user_id)->toBe($victim->id)
        ->and($attacker->partyBookings()->count())->toBe(0);
});

test('revoking database sessions preserves only the explicitly allowed session', function () {
    config([
        'session.driver' => 'database',
        'session.table' => 'sessions',
    ]);

    $user = User::factory()->create([
        'remember_token' => 'old-token',
    ]);

    foreach (['keep-session', 'revoke-session'] as $sessionId) {
        DB::table('sessions')->insert([
            'id' => $sessionId,
            'user_id' => $user->id,
            'ip_address' => null,
            'user_agent' => null,
            'payload' => '',
            'last_activity' => time(),
        ]);
    }

    app(RevokeUserSessions::class)->handle($user, 'keep-session');

    expect(
        DB::table('sessions')
            ->where('user_id', $user->id)
            ->pluck('id')
            ->all(),
    )->toBe(['keep-session'])
        ->and($user->refresh()->remember_token)->not->toBe('old-token');
});
