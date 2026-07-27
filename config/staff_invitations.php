<?php

return [
    'expires_after_hours' => (int) env(
        'STAFF_INVITATION_EXPIRES_AFTER_HOURS',
        72,
    ),
];
