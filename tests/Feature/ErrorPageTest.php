<?php

use App\Models\Article;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
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

test('latest article suggestions on error pages are cached', function () {
    Article::factory()->published()->create();
    Cache::forget('errors.latest-article-previews');

    $this->get('/missing-first')->assertNotFound();

    expect(Cache::has('errors.latest-article-previews'))->toBeTrue();

    Article::query()->delete();

    $this->get('/missing-second')
        ->assertNotFound()
        ->assertInertia(
            fn (Assert $page) => $page->has('latestArticles', 1),
        );
});

test('web responses include defensive security headers', function () {
    $response = $this->get('/');

    $response
        ->assertOk()
        ->assertHeader('X-Frame-Options', 'DENY')
        ->assertHeader('X-Content-Type-Options', 'nosniff')
        ->assertHeader(
            'Referrer-Policy',
            'strict-origin-when-cross-origin',
        )
        ->assertHeader(
            'Permissions-Policy',
            'camera=(), microphone=(), geolocation=()',
        );

    expect($response->headers->get('Content-Security-Policy'))
        ->toContain("default-src 'self'")
        ->toContain("'nonce-");
});

test('production responses enable HTTP strict transport security', function () {
    $this->app->detectEnvironment(fn (): string => 'production');

    $this->get('/')
        ->assertOk()
        ->assertHeader(
            'Strict-Transport-Security',
            'max-age=31536000; includeSubDomains',
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
