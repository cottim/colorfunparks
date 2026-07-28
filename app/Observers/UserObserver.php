<?php

namespace App\Observers;

use App\Models\User;
use App\UserRole;

class UserObserver
{
    /**
     * Handle the User "created" event.
     */
    public function created(User $user): void
    {
        if ($user->role !== UserRole::Customer) {
            return;
        }

        $user->playCardMembership()->create([
            'joined_at' => $user->created_at ?? now(),
        ]);
    }
}
