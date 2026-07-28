<?php

use App\Http\Controllers\AuthenticateCustomerController;
use App\Http\Controllers\ConfirmNewsletterSubscriptionController;
use App\Http\Controllers\CustomerAccountController;
use App\Http\Controllers\CustomerPartyBookingController;
use App\Http\Controllers\Management\CustomerController as ManagementCustomerController;
use App\Http\Controllers\Management\DashboardController as ManagementDashboardController;
use App\Http\Controllers\Management\InternalUserController;
use App\Http\Controllers\Management\PartyBookingController as ManagementPartyBookingController;
use App\Http\Controllers\NewsletterSubscriptionController;
use App\Http\Controllers\PartyBookingController;
use App\Http\Controllers\RequestCustomerLoginLinkController;
use App\Http\Controllers\StaffInvitationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get(
    '/',
    fn () => Inertia::render('welcome', [
        'partyPrograms' => config('party_bookings.programs'),
        'sharedPartyProgramIncludes' => config(
            'party_bookings.shared_program_includes',
        ),
        'partyProgramBadges' => config('party_bookings.program_badges'),
        'partyProgramConditions' => config(
            'party_bookings.program_conditions',
        ),
    ]),
)->name('home');

Route::middleware('guest')->group(function () {
    Route::redirect('/register', '/login')->name('register');
    Route::inertia('/admin-backend', 'auth/admin-login')
        ->name('admin.login');
    Route::post('/login/link', RequestCustomerLoginLinkController::class)
        ->middleware('throttle:customer-login-links')
        ->name('customer-login.request');
    Route::get(
        '/login/confirmar/{token}',
        AuthenticateCustomerController::class,
    )
        ->middleware(['signed:relative', 'throttle:10,1'])
        ->name('customer-login.authenticate');
    Route::get(
        '/convites/equipa/{token}',
        [StaffInvitationController::class, 'show'],
    )
        ->middleware('throttle:staff-invitations')
        ->name('staff-invitations.show');
    Route::post(
        '/convites/equipa/{token}',
        [StaffInvitationController::class, 'store'],
    )
        ->middleware('throttle:staff-invitations')
        ->name('staff-invitations.store');
});

Route::post('/newsletter', NewsletterSubscriptionController::class)
    ->middleware('throttle:newsletter-subscriptions')
    ->name('newsletter-subscriptions.store');
Route::get(
    '/newsletter/confirmar/{newsletterSubscription}/{token}',
    ConfirmNewsletterSubscriptionController::class,
)
    ->middleware(['signed', 'throttle:10,1'])
    ->name('newsletter-subscriptions.confirm');

Route::get('/marcar-festa', [PartyBookingController::class, 'create'])
    ->name('party-bookings.create');
Route::post('/marcar-festa', [PartyBookingController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('party-bookings.store');
Route::inertia('/marcar-festa/recebido', 'party-bookings/received')
    ->name('party-bookings.received');

Route::inertia('/politica-de-privacidade', 'legal/privacy-policy')
    ->name('legal.privacy-policy');
Route::inertia('/termos-e-condicoes', 'legal/terms-and-conditions')
    ->name('legal.terms-and-conditions');
Route::inertia('/politica-de-cookies', 'legal/cookie-policy')
    ->name('legal.cookie-policy');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::redirect('/dashboard', '/gestao')
        ->middleware('can:access-management')
        ->name('dashboard');

    Route::prefix('gestao')
        ->name('management.')
        ->middleware('can:access-management')
        ->group(function () {
            Route::get('/', ManagementDashboardController::class)
                ->name('index');
            Route::get('/festas', [ManagementPartyBookingController::class, 'index'])
                ->name('bookings.index');
            Route::get(
                '/festas/{partyBooking}',
                [ManagementPartyBookingController::class, 'show'],
            )->name('bookings.show');
            Route::get('/clientes', ManagementCustomerController::class)
                ->name('customers.index');
            Route::get('/utilizadores', [InternalUserController::class, 'index'])
                ->middleware('can:manage-internal-users')
                ->name('users.index');
            Route::post('/utilizadores', [InternalUserController::class, 'store'])
                ->middleware([
                    'can:manage-internal-users',
                    'throttle:staff-invitations',
                ])
                ->name('users.store');
        });
});

Route::middleware(['auth', 'can:access-customer-account'])
    ->prefix('conta')
    ->name('account.')
    ->group(function () {
        Route::get('/', CustomerAccountController::class)->name('index');
        Route::resource('festas', CustomerPartyBookingController::class)
            ->only(['index', 'show'])
            ->parameters(['festas' => 'partyBooking'])
            ->names([
                'index' => 'bookings.index',
                'show' => 'bookings.show',
            ]);
        Route::inertia('/perfil', 'account/profile')->name('profile.edit');
        Route::inertia('/preferencias', 'account/preferences')
            ->name('preferences.edit');
    });

require __DIR__.'/settings.php';
