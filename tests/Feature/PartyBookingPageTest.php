<?php

use Inertia\Testing\AssertableInertia as Assert;

test('the party booking page can be displayed', function () {
    $response = $this->get(route('party-bookings.create'));

    $response->assertOk()->assertInertia(
        fn (Assert $page) => $page->component('party-bookings/create'),
    );
});
