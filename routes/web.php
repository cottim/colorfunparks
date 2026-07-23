<?php

use App\Http\Controllers\NewsletterSubscriptionController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');
Route::post('/newsletter', NewsletterSubscriptionController::class)
    ->middleware('throttle:6,1')
    ->name('newsletter-subscriptions.store');

Route::inertia('/marcar-festa', 'party-bookings/create')
    ->name('party-bookings.create');

Route::inertia('/politica-de-privacidade', 'legal/privacy-policy')
    ->name('legal.privacy-policy');
Route::inertia('/termos-e-condicoes', 'legal/terms-and-conditions')
    ->name('legal.terms-and-conditions');
Route::inertia('/politica-de-cookies', 'legal/cookie-policy')
    ->name('legal.cookie-policy');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
