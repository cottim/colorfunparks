<?php

namespace App\Actions\Customer;

use App\Mail\CustomerLoginLinkMail;
use App\Models\CustomerLoginLink;
use App\Models\User;
use App\UserRole;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class SendCustomerLoginLink
{
    public function handle(string $email): void
    {
        $existingUser = User::query()
            ->where('email', $email)
            ->first();

        if (
            $existingUser !== null
            && $existingUser->role !== UserRole::Customer
        ) {
            return;
        }

        $plainTextToken = Str::random(64);
        $expirationMinutes = (int) config(
            'customer_auth.login_link_expiration_minutes',
        );

        CustomerLoginLink::query()->create([
            'email' => $email,
            'token_hash' => hash('sha256', $plainTextToken),
            'expires_at' => now()->addMinutes($expirationMinutes),
        ]);

        Mail::to($email)->send(
            new CustomerLoginLinkMail($plainTextToken),
        );
    }
}
