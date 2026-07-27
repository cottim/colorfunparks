<?php

namespace App\Http\Controllers;

use App\Actions\Customer\ClaimCustomerPartyBookings;
use App\Actions\Customer\ConsumeCustomerLoginLink;
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
    ): RedirectResponse {
        $email = $consumeCustomerLoginLink->handle($token);

        abort_unless($email !== null, 403);

        $user = Cache::lock(
            'customer-account:'.hash('sha256', $email),
            10,
        )->block(3, function () use ($email): User {
            $user = User::query()->firstOrCreate(
                ['email' => $email],
                [
                    'name' => $email,
                    'password' => Str::random(64),
                ],
            );

            abort_unless($user->role === UserRole::Customer, 403);

            if ($user->email_verified_at === null) {
                $user->forceFill([
                    'email_verified_at' => now(),
                ])->save();
            }

            return $user;
        });

        $claimCustomerPartyBookings->handle($user);

        Auth::login($user, remember: true);
        $request->session()->regenerate();

        return redirect()->intended(route('account.index'));
    }
}
