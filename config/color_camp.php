<?php

$firstDay = new DateTimeImmutable('2026-08-03');
$lastDay = new DateTimeImmutable('2026-08-28');
$availableDays = [];

for ($day = $firstDay; $day <= $lastDay; $day = $day->modify('+1 day')) {
    if ((int) $day->format('N') <= 5) {
        $availableDays[] = [
            'value' => $day->format('Y-m-d'),
            'label' => $day->format('d/m/Y'),
        ];
    }
}

return [
    'season' => 'Verão 2026',
    'first_day' => $firstDay->format('Y-m-d'),
    'last_day' => $lastDay->format('Y-m-d'),
    'minimum_age' => 4,
    'maximum_age' => 12,

    'weeks' => [
        [
            'value' => 'pink',
            'label' => 'Semana Rosa — 3 a 7 de agosto',
            'available' => false,
        ],
        [
            'value' => 'blue',
            'label' => 'Semana Azul — 10 a 14 de agosto',
            'available' => false,
        ],
        [
            'value' => 'orange',
            'label' => 'Semana Laranja — 17 a 21 de agosto',
            'available' => true,
        ],
        [
            'value' => 'green',
            'label' => 'Semana Verde — 24 a 28 de agosto',
            'available' => true,
        ],
    ],

    'days' => $availableDays,

    'lunch_options' => [
        ['value' => 'park', 'label' => 'Almoça no Color Party (+3 €/dia)'],
        ['value' => 'home', 'label' => 'Leva almoço de casa'],
        ['value' => 'offsite', 'label' => 'Não almoça no Color Party'],
    ],

    'discounts' => [
        ['value' => 'sibling', 'label' => 'Inscrição de irmãos'],
        ['value' => 'play-card', 'label' => 'Cartão da Brincadeira'],
    ],

    'photo_consents' => [
        ['value' => 'yes', 'label' => 'Sim, autorizo'],
        ['value' => 'no', 'label' => 'Não autorizo'],
        [
            'value' => 'no-face',
            'label' => 'Apenas se o rosto não for revelado',
        ],
    ],
];
