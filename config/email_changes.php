<?php

return [
    'expiration_minutes' => 60,
    'resend_cooldown_minutes' => 10,
    'rate_limits' => [
        'per_minute_per_user' => 6,
        'per_hour_per_email' => 5,
    ],
];
