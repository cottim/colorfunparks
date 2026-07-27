<?php

namespace App\Actions\Customer;

use App\Models\CustomerLoginLink;
use Illuminate\Support\Facades\DB;

class ConsumeCustomerLoginLink
{
    public function handle(string $plainTextToken): ?string
    {
        return DB::transaction(function () use ($plainTextToken): ?string {
            $loginLink = CustomerLoginLink::query()
                ->where(
                    'token_hash',
                    hash('sha256', $plainTextToken),
                )
                ->whereNull('used_at')
                ->where('expires_at', '>', now())
                ->lockForUpdate()
                ->first();

            if ($loginLink === null) {
                return null;
            }

            $loginLink->update(['used_at' => now()]);

            return $loginLink->email;
        });
    }
}
