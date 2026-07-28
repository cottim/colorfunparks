<?php

use App\Http\Controllers\Settings\EmailChangeController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\SecurityController;
use Illuminate\Auth\Middleware\RequirePassword;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::get('settings/profile/email', [EmailChangeController::class, 'edit'])
        ->middleware(RequirePassword::class)
        ->name('profile.email.edit');
    Route::post('settings/profile/email', [EmailChangeController::class, 'store'])
        ->middleware([RequirePassword::class, 'throttle:6,1'])
        ->name('profile.email.store');
    Route::delete('settings/profile/email', [EmailChangeController::class, 'destroy'])
        ->middleware('throttle:6,1')
        ->name('profile.email.destroy');
});

Route::get(
    'settings/profile/email/{pendingEmailChange}/{token}',
    [EmailChangeController::class, 'confirm'],
)
    ->middleware(['signed:relative', 'throttle:6,1'])
    ->name('profile.email.confirm');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/security', [SecurityController::class, 'edit'])
        ->middleware(RequirePassword::class)
        ->name('security.edit');

    Route::put('settings/password', [SecurityController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    Route::inertia('settings/appearance', 'settings/appearance')->name('appearance.edit');
});

Route::get('.well-known/passkey-endpoints', function () {
    return response()->json([
        'enroll' => route('security.edit'),
        'manage' => route('security.edit'),
    ]);
})->name('well-known.passkeys');
