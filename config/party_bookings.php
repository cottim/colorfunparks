<?php

$firstPartyTimeInMinutes = 10 * 60;
$lastPartyTimeInMinutes = 17 * 60 + 30;
$partyTimeIntervalInMinutes = 30;

$partyTimes = [];

for (
    $minutes = $firstPartyTimeInMinutes;
    $minutes <= $lastPartyTimeInMinutes;
    $minutes += $partyTimeIntervalInMinutes
) {
    $partyTimes[] = sprintf('%02d:%02d', intdiv($minutes, 60), $minutes % 60);
}

return [
    'max_months_ahead' => 3,

    'parks' => [
        ['value' => 'color-party', 'label' => 'Color Party'],
        ['value' => 'yupi-color', 'label' => 'Yupi Color'],
        ['value' => 'kiddy-color', 'label' => 'Kiddy Color'],
    ],

    'programs' => [
        [
            'value' => 'essential',
            'label' => 'Festa Essencial',
            'description' => 'A proposta base para celebrar e brincar no parque.',
        ],
        [
            'value' => 'snack',
            'label' => 'Festa com Lanche',
            'description' => 'A experiência de festa com uma opção de lanche.',
        ],
        [
            'value' => 'special',
            'label' => 'Festa Especial',
            'description' => 'Uma celebração com serviços adicionais.',
        ],
    ],

    'party_times' => $partyTimes,
];
