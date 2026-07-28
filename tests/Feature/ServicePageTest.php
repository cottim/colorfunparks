<?php

use Inertia\Testing\AssertableInertia as Assert;

test('public service pages can be displayed', function (
    string $routeName,
    string $component,
) {
    $this->get(route($routeName))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page->component($component),
        );
})->with([
    'hourly play' => [
        'services.hourly-play',
        'services/hourly-play',
    ],
    'play card' => [
        'services.play-card',
        'services/play-card',
    ],
    'Color Camp' => [
        'services.color-camp',
        'services/color-camp',
    ],
]);

test('the play card service explains the free account benefit', function () {
    $accountCta = file_get_contents(
        resource_path(
            'js/components/services/play-card-account-cta.tsx',
        ),
    );
    $servicesSection = file_get_contents(
        resource_path('js/components/home/services-section.tsx'),
    );
    $playCardPage = file_get_contents(
        resource_path('js/pages/services/play-card.tsx'),
    );

    expect($accountCta)
        ->toContain('O Cartão da Brincadeira é gratuito')
        ->toContain('Criar conta gratuita')
        ->toContain('30 dias de benefícios incluídos')
        ->toContain('href={href}')
        ->and($servicesSection)
        ->toContain('<PlayCardAccountCta appearance="compact" />')
        ->and($playCardPage)
        ->toContain('<PlayCardAccountCta className="pt-4 sm:pt-8" />')
        ->toContain('Gratuito com a tua conta');
});

test('Color Camp calls to action link to its registration form', function () {
    $featuredCampaignHero = file_get_contents(
        resource_path(
            'js/components/home/featured-campaign-hero.tsx',
        ),
    );
    $servicesSection = file_get_contents(
        resource_path('js/components/home/services-section.tsx'),
    );
    $colorCampPage = file_get_contents(
        resource_path('js/pages/services/color-camp.tsx'),
    );

    expect($featuredCampaignHero)
        ->toContain(
            "import { create as createColorCampRegistration } from '@/routes/color-camp-registrations';",
        )
        ->toContain(
            "import { colorCamp } from '@/routes/services';",
        )
        ->toContain('<Link href={createColorCampRegistration()}>')
        ->toContain('Inscrever já')
        ->toContain('<Link href={colorCamp()}>Saber mais</Link>')
        ->and($servicesSection)
        ->toContain(
            "import { create as createColorCampRegistration } from '@/routes/color-camp-registrations';",
        )
        ->toContain("label: 'Inscrever no Color Camp'")
        ->toContain('href: createColorCampRegistration()')
        ->and($colorCampPage)
        ->toContain('<Link href={createColorCampRegistration()}>')
        ->toContain('Inscrever no Color Camp');
});
