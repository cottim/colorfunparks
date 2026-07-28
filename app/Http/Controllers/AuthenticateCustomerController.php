<?php

namespace App\Http\Controllers;

use App\Actions\Auth\RevokeUserSessions;
use App\Actions\Customer\ClaimCustomerColorCampRegistrations;
use App\Actions\Customer\ClaimCustomerPartyBookings;
use App\Actions\Customer\ConsumeCustomerLoginLink;
use App\Actions\Customer\RecordCustomerLegalConsent;
use App\Models\User;
use App\UserRole;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class AuthenticateCustomerController extends Controller
{
    public function __invoke(
        Request $request,
        string $token,
        ConsumeCustomerLoginLink $consumeCustomerLoginLink,
        ClaimCustomerPartyBookings $claimCustomerPartyBookings,
        ClaimCustomerColorCampRegistrations $claimCustomerColorCampRegistrations,
        RevokeUserSessions $revokeUserSessions,
        RecordCustomerLegalConsent $recordCustomerLegalConsent,
    ): RedirectResponse {
        $loginLink = $consumeCustomerLoginLink->handle($token);

        abort_unless($loginLink !== null, 403);

        $user = Cache::lock(
            'customer-account:'.hash('sha256', $loginLink->email),
            10,
        )->block(3, function () use (
            $loginLink,
            $revokeUserSessions,
            $recordCustomerLegalConsent,
        ): User {
            $user = User::query()->firstOrCreate(
                ['email' => $loginLink->email],
                [
                    'name' => $loginLink->email,
                    'password' => Str::random(64),
                ],
            );

            abort_unless($user->role === UserRole::Customer, 403);

            if ($user->email_verified_at === null) {
                $revokeUserSessions->handle($user);

                $user->forceFill([
                    'email_verified_at' => now(),
                ])->save();
            }

            if (
                ! $user->hasAcceptedCurrentLegalConsent()
                &&
                $loginLink->privacy_accepted_at !== null
                && $loginLink->terms_accepted_at !== null
                && $loginLink->legal_consent_version !== null
            ) {
                $recordCustomerLegalConsent->handle(
                    $user,
                    $loginLink->privacy_accepted_at,
                    $loginLink->terms_accepted_at,
                    $loginLink->legal_consent_version,
                );
            }

            return $user;
        });

        $claimCustomerPartyBookings->handle($user);
        $claimCustomerColorCampRegistrations->handle($user);

        Auth::login($user, remember: true);
        $request->session()->regenerate();
        $request->session()->passwordConfirmed();

        return redirect()->intended(route('account.index'));
    }
}
