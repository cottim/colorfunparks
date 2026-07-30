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

    'rate_limits' => [
        'per_minute_per_ip' => 5,
        'per_hour_per_ip' => 20,
        'per_hour_per_email' => 3,
    ],

    'parks' => [
        ['value' => 'color-party', 'label' => 'Color Party'],
        ['value' => 'yupi-color', 'label' => 'Yupi Color'],
        ['value' => 'kiddy-color', 'label' => 'Kiddy Color'],
    ],

    'programs' => [
        [
            'value' => 'color',
            'label' => 'Menu Color',
            'description' => 'Uma opção simples, colorida e cheia de brincadeira.',
            'accent' => 'sky',
            'duration' => '2h30',
            'minimumAge' => 5,
            'maximumAge' => 10,
            'guestAgeRange' => '3 aos 12 anos',
            'availability' => 'Disponibilidade sujeita a confirmação',
            'startingPrice' => '15,50 €',
            'includes' => [
                'Convites em papel ou digitais',
                'Pinturas faciais',
                'Sala exclusiva para o lanche',
                'Bolo de aniversário temático',
                'Pão com fiambre ou queijo',
                'Água e sumo',
            ],
            'choiceGroups' => [
                [
                    'value' => 'snack',
                    'label' => 'Acompanhamento',
                    'prompt' => 'Escolhe o acompanhamento',
                    'description' => 'Escolhe uma opção.',
                    'options' => [
                        [
                            'value' => 'fries',
                            'label' => 'Batatas fritas',
                            'icon' => 'fries',
                        ],
                        [
                            'value' => 'popcorn',
                            'label' => 'Pipocas',
                            'icon' => 'popcorn',
                        ],
                    ],
                ],
                [
                    'value' => 'dessert',
                    'label' => 'Sobremesa',
                    'prompt' => 'Escolhe a sobremesa',
                    'description' => 'Escolhe uma opção.',
                    'options' => [
                        [
                            'value' => 'chocolate-mousse',
                            'label' => 'Mousse de chocolate',
                            'icon' => 'mousse',
                        ],
                        [
                            'value' => 'gelatin',
                            'label' => 'Gelatina',
                            'icon' => 'gelatin',
                        ],
                        [
                            'value' => 'ice-cream',
                            'label' => 'Gelado',
                            'icon' => 'ice-cream',
                        ],
                    ],
                ],
            ],
            'pricing' => [
                [
                    'label' => 'Semana',
                    'upToTwenty' => '15,50 € / criança',
                    'extraChild' => '14,50 € / criança',
                ],
                [
                    'label' => 'Fins de semana e feriados',
                    'upToTwenty' => '17,00 € / criança',
                    'extraChild' => '16,00 € / criança',
                ],
            ],
        ],
        [
            'value' => 'balance',
            'label' => 'Menu Balance',
            'description' => 'Uma proposta equilibrada com fruta e opções sem açúcar.',
            'accent' => 'purple',
            'duration' => '2h30',
            'minimumAge' => 5,
            'maximumAge' => 10,
            'guestAgeRange' => '3 aos 12 anos',
            'availability' => 'Disponibilidade sujeita a confirmação',
            'startingPrice' => '17,50 €',
            'includes' => [
                'Convites em papel ou digitais',
                'Pinturas faciais',
                'Sala exclusiva para o lanche',
                'Bolo de aniversário temático',
                'Pão de cereais com fiambre ou queijo sem lactose',
                'Tacinha de fruta',
                'Água, sumo 100% ou néctar',
            ],
            'choiceGroups' => [
                [
                    'value' => 'dessert',
                    'label' => 'Sobremesa',
                    'prompt' => 'Escolhe a sobremesa',
                    'description' => 'Escolhe uma opção.',
                    'options' => [
                        [
                            'value' => 'gelatin',
                            'label' => 'Gelatina',
                            'icon' => 'gelatin',
                        ],
                        [
                            'value' => 'sugar-free-ice-cream',
                            'label' => 'Gelado 0% açúcar',
                            'icon' => 'ice-cream',
                        ],
                    ],
                ],
            ],
            'pricing' => [
                [
                    'label' => 'Semana',
                    'upToTwenty' => '17,50 € / criança',
                    'extraChild' => '16,50 € / criança',
                ],
                [
                    'label' => 'Fins de semana e feriados',
                    'upToTwenty' => '19,00 € / criança',
                    'extraChild' => '18,00 € / criança',
                ],
            ],
        ],
        [
            'value' => 'lunch-party',
            'label' => 'Menu Lunch Party',
            'description' => 'Uma refeição mais completa para festas à hora de almoço.',
            'accent' => 'yellow',
            'duration' => '2h45',
            'minimumAge' => 5,
            'maximumAge' => 10,
            'guestAgeRange' => '3 aos 12 anos',
            'availability' => 'Sábados e feriados, às 12h30',
            'startingPrice' => '19,00 €',
            'includes' => [
                'Convites em papel ou digitais',
                'Pinturas faciais',
                'Sala exclusiva para o lanche',
                'Bolo de aniversário temático',
                'Batatas fritas e nuggets',
                'Água e sumo',
            ],
            'choiceGroups' => [
                [
                    'value' => 'main',
                    'label' => 'Prato principal',
                    'prompt' => 'Escolhe o prato principal',
                    'description' => 'Escolhe uma opção.',
                    'options' => [
                        [
                            'value' => 'pizza',
                            'label' => 'Pizza',
                            'icon' => 'pizza',
                        ],
                        [
                            'value' => 'hot-dog',
                            'label' => 'Cachorro',
                            'icon' => 'hot-dog',
                        ],
                    ],
                ],
                [
                    'value' => 'dessert',
                    'label' => 'Sobremesa',
                    'prompt' => 'Escolhe a sobremesa',
                    'description' => 'Escolhe uma opção.',
                    'options' => [
                        [
                            'value' => 'chocolate-mousse',
                            'label' => 'Mousse de chocolate',
                            'icon' => 'mousse',
                        ],
                        [
                            'value' => 'gelatin',
                            'label' => 'Gelatina',
                            'icon' => 'gelatin',
                        ],
                        [
                            'value' => 'ice-cream',
                            'label' => 'Gelado',
                            'icon' => 'ice-cream',
                        ],
                    ],
                ],
            ],
            'pricing' => [
                [
                    'label' => 'Sábados e feriados',
                    'upToTwenty' => '19,00 € / criança',
                    'extraChild' => '18,00 € / criança',
                ],
            ],
        ],
    ],

    'shared_program_includes' => [
        'Convites em papel ou digitais',
        'Pinturas faciais',
        'Sala exclusiva para o lanche',
        'Bolo de aniversário temático',
    ],

    'program_badges' => [
        [
            'programValue' => 'color',
            'text' => 'Mais escolhido',
            'variant' => 'popular',
        ],
        [
            'programValue' => 'balance',
            'text' => 'Saudável',
            'variant' => 'healthy',
        ],
    ],

    'program_conditions' => [
        'Pagamento mínimo de 10 crianças',
        'Sinal de reserva de 80 € não reembolsável',
        'Lembrança opcional: 1,50 € por criança',
        'Uso obrigatório de meias antiderrapantes',
    ],

    'party_times' => $partyTimes,
];
