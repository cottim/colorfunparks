<?php

namespace App\Policies;

use App\Models\PartyBooking;
use App\Models\User;

class PartyBookingPolicy
{
    public function view(User $user, PartyBooking $partyBooking): bool
    {
        return $partyBooking->user_id === $user->id;
    }
}
