<?php

namespace App\Policies;

use App\Models\ColorCampRegistration;
use App\Models\User;

class ColorCampRegistrationPolicy
{
    public function view(
        User $user,
        ColorCampRegistration $colorCampRegistration,
    ): bool {
        return $colorCampRegistration->user_id === $user->id;
    }
}
