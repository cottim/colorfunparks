<?php

return [
    'media_disk' => env('CONTENT_MEDIA_DISK', 'public'),

    'homepage_article_limit' => 3,

    'categories' => [
        ['value' => 'festas', 'label' => 'Festas'],
        ['value' => 'color-camp', 'label' => 'Color Camp'],
        ['value' => 'seguranca', 'label' => 'Segurança'],
        ['value' => 'atividades', 'label' => 'Atividades'],
        ['value' => 'bastidores', 'label' => 'Bastidores'],
        ['value' => 'novidades', 'label' => 'Novidades'],
    ],

    'block_types' => [
        ['value' => 'heading', 'label' => 'Título de secção'],
        ['value' => 'paragraph', 'label' => 'Parágrafo'],
        ['value' => 'callout', 'label' => 'Destaque'],
        ['value' => 'list', 'label' => 'Lista'],
    ],
];
