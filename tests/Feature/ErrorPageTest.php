<?php

use App\Models\Article;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('unknown web pages use the public not found page', function () {
    $publishedArticle = Article::factory()->published()->create();
    Article::factory()->create();

    $this->get('/uma-pagina-que-nao-existe')
        ->assertNotFound()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('errors/not-found')
                ->where('canAccessManagement', false)
                ->has('latestArticles', 1)
                ->where('latestArticles.0.id', $publishedArticle->id),
        );
});

test('forbidden customer pages are presented as not found', function () {
    $customer = User::factory()->create();

    $this->actingAs($customer)
        ->get(route('management.index'))
        ->assertNotFound()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('errors/not-found')
                ->where('canAccessManagement', false),
        );
});

test('internal users receive a route back to management', function () {
    $staff = User::factory()->staff()->create();

    $this->actingAs($staff)
        ->get(route('management.users.index'))
        ->assertNotFound()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('errors/not-found')
                ->where('canAccessManagement', true),
        );
});

test('json requests keep their original forbidden response', function () {
    $customer = User::factory()->create();

    $this->actingAs($customer)
        ->getJson(route('management.index'))
        ->assertForbidden();
});
