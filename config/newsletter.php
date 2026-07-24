<?php

return [
    'confirmation_expiration_minutes' => 60,
    'confirmation_resend_cooldown_minutes' => 10,
    'pending_retention_days' => 7,
    'rate_limits' => [
        'per_minute_per_ip' => 3,
        'per_hour_per_ip' => 20,
        'per_hour_per_email' => 5,
    ],
];
