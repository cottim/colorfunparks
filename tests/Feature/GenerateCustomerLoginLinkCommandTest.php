<?php

use App\Models\CustomerLoginLink;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

test('a local login link authenticates a customer without sending email', function () {
    $this->app->detectEnvironment(fn (): string => 'local');
    Mail::fake();

    $exitCode = Artisan::call('customer:login-link', [
        'email' => '  CUSTOMER@EXAMPLE.COM ',
    ]);

    expect($exitCode)->toBe(0);

    preg_match(
        '/https?:\/\/\S+/',
        Artisan::output(),
        $loginUrlMatches,
    );

    $loginUrl = $loginUrlMatches[0] ?? null;

    expect($loginUrl)->not->toBeNull();

    $loginRequest = Request::create($loginUrl);
    $plainTextToken = basename($loginRequest->path());

    expect($loginRequest->hasValidSignature(false))
        ->toBeTrue()
        ->and(
            CustomerLoginLink::query()
                ->where(
                    'token_hash',
                    hash('sha256', $plainTextToken),
                )
                ->value('email'),
        )
        ->toBe('customer@example.com');

    $this->get($loginUrl)
        ->assertRedirect(route('account.index'))
        ->assertCookie(Auth::guard()->getRecallerName());

    $customer = User::query()->sole();

    $this->assertAuthenticatedAs($customer);
    expect($customer->hasAcceptedCurrentLegalConsent())->toBeFalse();
    Mail::assertNothingQueued();
});

test('the login link command is unavailable outside the local environment', function () {
    $this->app->detectEnvironment(fn (): string => 'production');

    $this->artisan('customer:login-link', [
        'email' => 'customer@example.com',
    ])
        ->expectsOutputToContain(
            'Este comando só está disponível no ambiente local.',
        )
        ->assertFailed();

    expect(CustomerLoginLink::query()->count())->toBe(0);
});

test('the login link command rejects invalid emails', function () {
    $this->app->detectEnvironment(fn (): string => 'local');

    $this->artisan('customer:login-link', [
        'email' => 'email-invalido',
    ])->assertFailed();

    expect(CustomerLoginLink::query()->count())->toBe(0);
});

test('the login link command cannot authenticate internal users', function () {
    $this->app->detectEnvironment(fn (): string => 'local');
    User::factory()->staff()->create([
        'email' => 'staff@example.com',
    ]);

    $this->artisan('customer:login-link', [
        'email' => 'staff@example.com',
    ])
        ->expectsOutputToContain(
            'Este email pertence a uma conta de staff ou administrador.',
        )
        ->assertFailed();

    expect(CustomerLoginLink::query()->count())->toBe(0);
});
