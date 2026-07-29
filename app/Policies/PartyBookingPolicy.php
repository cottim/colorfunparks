<?php

namespace App\Policies;

use App\Models\PartyBooking;
use App\Models\User;
use App\UserRole;

class PartyBookingPolicy
{
    public function view(User $user, PartyBooking $partyBooking): bool
    {
        return $partyBooking->user_id === $user->id;
    }

    public function archive(User $user): bool
    {
        return $user->canAccessManagement();
    }

    public function delete(User $user): bool
    {
        return $user->role === UserRole::Admin;
    }
}
