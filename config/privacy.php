<?php

return [
    'retention_days' => [
        'party_bookings' => (int) env('PARTY_BOOKING_RETENTION_DAYS', 730),
        'color_camp_registrations' => (int) env('COLOR_CAMP_RETENTION_DAYS', 730),
    ],
];
