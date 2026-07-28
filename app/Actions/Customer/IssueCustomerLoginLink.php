<?php

namespace App\Actions\Customer;

use App\Models\CustomerLoginLink;
use App\Models\User;
use App\UserRole;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;

class IssueCustomerLoginLink
{
    public function handle(string $email): ?string
    {
        $normalizedEmail = Str::lower(trim($email));
        $existingUser = User::query()
            ->where('email', $normalizedEmail)
            ->first();

        if (
            $existingUser !== null
            && $existingUser->role !== UserRole::Customer
        ) {
            return null;
        }

        $plainTextToken = Str::random(64);
        $expirationMinutes = (int) config(
            'customer_auth.login_link_expiration_minutes',
        );

        CustomerLoginLink::query()->create([
            'email' => $normalizedEmail,
            'token_hash' => hash('sha256', $plainTextToken),
            'expires_at' => now()->addMinutes($expirationMinutes),
        ]);

        return URL::to(
            URL::temporarySignedRoute(
                'customer-login.authenticate',
                now()->addMinutes($expirationMinutes),
                ['token' => $plainTextToken],
                absolute: false,
            ),
        );
    }
}
