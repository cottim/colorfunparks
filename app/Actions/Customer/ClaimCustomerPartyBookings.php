<?php

namespace App\Actions\Customer;

use App\Models\PartyBooking;
use App\Models\User;

class ClaimCustomerPartyBookings
{
    public function handle(User $customer): int
    {
        if ($customer->email_verified_at === null) {
            return 0;
        }

        return PartyBooking::query()
            ->whereNull('user_id')
            ->where('contact_email', $customer->email)
            ->update(['user_id' => $customer->id]);
    }
}
