<?php

use Inertia\Testing\AssertableInertia as Assert;

test('legal pages can be displayed', function (string $route, string $component) {
    $this->get(route($route))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page->component($component),
        );
})->with([
    'privacy policy' => [
        'legal.privacy-policy',
        'legal/privacy-policy',
    ],
    'terms and conditions' => [
        'legal.terms-and-conditions',
        'legal/terms-and-conditions',
    ],
    'cookie policy' => [
        'legal.cookie-policy',
        'legal/cookie-policy',
    ],
]);
