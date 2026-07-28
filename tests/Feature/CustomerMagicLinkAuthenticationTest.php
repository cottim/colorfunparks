<?php

use App\Mail\CustomerLoginLinkMail;
use App\Models\CustomerLoginLink;
use App\Models\PartyBooking;
use App\Models\User;
use App\UserRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    Cache::flush();
    $this->withSession(['_token' => 'test-csrf-token']);
});

test('login is an email only customer access page', function () {
    $this->get(route('login'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('auth/login')
            ->missing('canResetPassword'));
});

test('register uses the same customer access page', function () {
    $this->get(route('register'))
        ->assertRedirect(route('login'));
});

test('authenticated customers are redirected from login and register to their account', function () {
    $customer = User::factory()->create();

    $this->actingAs($customer)
        ->get(route('login'))
        ->assertRedirect(route('account.index'));

    $this->get(route('register'))
        ->assertRedirect(route('account.index'));
});

test('requesting access sends a neutral response without creating an account', function () {
    Mail::fake();

    $this->post(route('customer-login.request'), [
        '_token' => 'test-csrf-token',
        'email' => '  CUSTOMER@EXAMPLE.COM ',
    ])
        ->assertRedirect()
        ->assertSessionHas(
            'status',
            'Se o endereço estiver disponível para acesso, receberás um email com o teu link.',
        );

    expect(User::query()->count())->toBe(0);

    Mail::assertQueued(
        CustomerLoginLinkMail::class,
        fn (CustomerLoginLinkMail $mail): bool => $mail->hasTo(
            'customer@example.com',
        ),
    );
});

test('a valid emailed link creates and authenticates a customer', function () {
    Mail::fake();

    $this->post(route('customer-login.request'), [
        '_token' => 'test-csrf-token',
        'email' => 'customer@example.com',
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

    $loginRequest = Request::create($loginMail->loginUrl);
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

    $this->get($loginMail->loginUrl)
        ->assertRedirect(route('account.index'))
        ->assertSessionHas('auth.password_confirmed_at')
        ->assertCookie(Auth::guard()->getRecallerName());

    $customer = User::query()->sole();

    expect($customer->role)
        ->toBe(UserRole::Customer)
        ->and($customer->email)
        ->toBe('customer@example.com')
        ->and($customer->email_verified_at)
        ->not->toBeNull();

    $this->assertAuthenticatedAs($customer);
});

test('validating an email claims matching guest party bookings', function () {
    Mail::fake();

    $booking = PartyBooking::factory()->create([
        'user_id' => null,
        'contact_email' => 'customer@example.com',
    ]);

    $this->post(route('customer-login.request'), [
        '_token' => 'test-csrf-token',
        'email' => 'customer@example.com',
    ])->assertRedirect();

    $loginMail = null;

    Mail::assertQueued(
        CustomerLoginLinkMail::class,
        function (CustomerLoginLinkMail $mail) use (&$loginMail): bool {
            $loginMail = $mail;

            return true;
        },
    );

    $this->get($loginMail->loginUrl)
        ->assertRedirect(route('account.index'));

    $customer = User::query()->sole();

    expect($booking->refresh()->user_id)->toBe($customer->id);
});

test('an emailed link can only be used once', function () {
    Mail::fake();

    $this->post(route('customer-login.request'), [
        '_token' => 'test-csrf-token',
        'email' => 'customer@example.com',
    ])->assertRedirect();

    $loginMail = null;

    Mail::assertQueued(
        CustomerLoginLinkMail::class,
        function (CustomerLoginLinkMail $mail) use (&$loginMail): bool {
            $loginMail = $mail;

            return true;
        },
    );

    $this->get($loginMail->loginUrl)
        ->assertRedirect(route('account.index'));

    $this->post(route('logout'), [
        '_token' => 'test-csrf-token',
    ]);

    $this->get($loginMail->loginUrl)->assertForbidden();
});

test('an expired emailed link cannot authenticate or create a customer', function () {
    Mail::fake();

    $this->post(route('customer-login.request'), [
        '_token' => 'test-csrf-token',
        'email' => 'customer@example.com',
    ])->assertRedirect();

    $loginMail = null;

    Mail::assertQueued(
        CustomerLoginLinkMail::class,
        function (CustomerLoginLinkMail $mail) use (&$loginMail): bool {
            $loginMail = $mail;

            return true;
        },
    );

    $this->travel(
        (int) config('customer_auth.login_link_expiration_minutes') + 1,
    )->minutes();

    $this->get($loginMail->loginUrl)->assertForbidden();

    $this->assertGuest();
    expect(User::query()->count())->toBe(0);
});

test('requesting a customer link requires a valid email address', function () {
    Mail::fake();

    $this->post(route('customer-login.request'), [
        '_token' => 'test-csrf-token',
        'email' => 'not-an-email',
    ])
        ->assertSessionHasErrors('email');

    expect(User::query()->count())
        ->toBe(0)
        ->and(CustomerLoginLink::query()->count())
        ->toBe(0);

    Mail::assertNothingQueued();
});

test('staff and administrators cannot bypass their authentication with a customer link', function (UserRole $role) {
    Mail::fake();

    User::factory()->create([
        'email' => 'team@example.com',
        'role' => $role,
    ]);

    $this->post(route('customer-login.request'), [
        '_token' => 'test-csrf-token',
        'email' => 'team@example.com',
    ])
        ->assertRedirect()
        ->assertSessionHas('status');

    Mail::assertNothingQueued();
})->with([
    UserRole::Staff,
    UserRole::Admin,
]);

test('the customer account rejects staff and administrators', function () {
    $staff = User::factory()->staff()->create();

    $this->actingAs($staff)
        ->get(route('account.index'))
        ->assertForbidden();
});
