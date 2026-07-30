<?php

namespace App\Actions\Management;

use App\Models\ColorCampRegistration;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class LogColorCampRegistrationAccess
{
    public function handle(
        User $actor,
        ColorCampRegistration $registration,
    ): void {
        Log::notice(
            'Sensitive Color Camp registration data accessed.',
            [
                'event' => 'color_camp_registration.sensitive_data_accessed',
                'actor_user_id' => $actor->id,
                'color_camp_registration_id' => $registration->id,
            ],
        );
    }
}
