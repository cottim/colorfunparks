<?php

use App\ArticleStatus;
use App\Models\Article;
use App\Models\ArticleImage;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    config(['content.media_disk' => 'article-test']);
    Storage::fake('article-test');
});

test('only published articles are visible on the public website', function () {
    $published = Article::factory()->published()->create([
        'title' => 'Segurança alimentar nas festas',
        'slug' => 'seguranca-alimentar-nas-festas',
    ]);
    $draft = Article::factory()->create([
        'title' => 'Rascunho privado',
        'slug' => 'rascunho-privado',
    ]);
    $future = Article::factory()->published()->create([
        'title' => 'Publicação futura',
        'slug' => 'publicacao-futura',
        'published_at' => now()->addDay(),
    ]);

    $this->get(route('articles.index'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('articles/index')
                ->has('articles.data', 1)
                ->where('articles.data.0.title', $published->title),
        );

    $this->get(route('articles.show', $published->slug))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('articles/show')
                ->where('article.slug', $published->slug),
        );

    $this->get(route('articles.show', $draft->slug))->assertNotFound();
    $this->get(route('articles.show', $future->slug))->assertNotFound();
});

test('the homepage receives the latest published articles', function () {
    Article::factory()->published()->create([
        'title' => 'Artigo mais antigo',
        'published_at' => now()->subDays(2),
    ]);
    $latest = Article::factory()->published()->create([
        'title' => 'Artigo mais recente',
        'published_at' => now()->subDay(),
    ]);
    Article::factory()->create(['title' => 'Rascunho']);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('welcome')
                ->has('latestArticles', 2)
                ->where('latestArticles.0.title', $latest->title),
        );
});

test('staff can create an article with a cover and gallery', function () {
    $staff = User::factory()->staff()->create();
    $cover = UploadedFile::fake()->image('capa.jpg', 1200, 700);
    $gallery = UploadedFile::fake()->image('atividade.webp', 900, 700);

    $this->actingAs($staff)
        ->post(
            route('management.articles.store'),
            validArticlePayload([
                'cover_image' => $cover,
                'cover_image_alt' => 'Crianças numa festa acompanhada',
                'gallery' => [$gallery],
                'gallery_alt_texts' => [
                    'Crianças durante uma atividade do parque',
                ],
            ]),
        )
        ->assertRedirect();

    $article = Article::query()->sole();
    $article->load('images');

    expect($article->author_id)
        ->toBe($staff->id)
        ->and($article->slug)
        ->toBe('seguranca-alimentar-nas-festas')
        ->and($article->status)
        ->toBe(ArticleStatus::Draft)
        ->and($article->images)
        ->toHaveCount(1)
        ->and($article->images->first()->alt_text)
        ->toBe('Crianças durante uma atividade do parque');

    Storage::disk('article-test')
        ->assertExists($article->cover_image_path);
    Storage::disk('article-test')
        ->assertExists($article->images->first()->path);
});

test('publishing an article makes it immediately available', function () {
    $staff = User::factory()->staff()->create();
    $article = Article::factory()->recycle($staff)->create();

    $this->actingAs($staff)
        ->patch(
            route('management.articles.update', $article),
            validArticlePayload(['status' => 'published']),
        )
        ->assertRedirect();

    expect($article->refresh()->published_at)->not->toBeNull();

    $this->get(route('articles.show', $article->slug))->assertOk();
});

test('staff can remove article images without touching another article', function () {
    $staff = User::factory()->staff()->create();
    $article = Article::factory()->recycle($staff)->create();
    $image = ArticleImage::factory()->recycle($article)->create([
        'path' => 'articles/gallery/current.jpg',
    ]);
    $otherImage = ArticleImage::factory()->create();
    Storage::disk('article-test')->put($image->path, 'image');

    $this->actingAs($staff)
        ->patch(
            route('management.articles.update', $article),
            validArticlePayload([
                'remove_gallery_image_ids' => [$otherImage->id],
            ]),
        )
        ->assertSessionHasErrors('remove_gallery_image_ids.0');

    $this->assertModelExists($image);
    $this->assertModelExists($otherImage);

    $this->actingAs($staff)
        ->patch(
            route('management.articles.update', $article),
            validArticlePayload([
                'remove_gallery_image_ids' => [$image->id],
            ]),
        )
        ->assertRedirect();

    $this->assertModelMissing($image);
    Storage::disk('article-test')->assertMissing($image->path);
});

test('customers cannot manage articles', function () {
    $customer = User::factory()->create();
    $article = Article::factory()->create();

    $this->actingAs($customer)
        ->get(route('management.articles.index'))
        ->assertNotFound();
    $this->actingAs($customer)
        ->post(
            route('management.articles.store'),
            validArticlePayload(),
        )
        ->assertForbidden();
    $this->actingAs($customer)
        ->patch(
            route('management.articles.update', $article),
            validArticlePayload(),
        )
        ->assertForbidden();
});

test('staff can filter and order the article list', function () {
    $staff = User::factory()->staff()->create(['name' => 'Beatriz']);
    $otherAuthor = User::factory()->staff()->create(['name' => 'Carlos']);
    $matchingArticle = Article::factory()
        ->recycle($staff)
        ->published()
        ->create([
            'title' => 'A segurança nas festas',
            'category' => 'seguranca',
        ]);
    Article::factory()->recycle($staff)->create([
        'title' => 'Um rascunho de segurança',
        'category' => 'seguranca',
    ]);
    Article::factory()->recycle($otherAuthor)->published()->create([
        'title' => 'Color Camp',
        'category' => 'color-camp',
    ]);

    $this->actingAs($staff)
        ->get(route('management.articles.index', [
            'query' => 'festas',
            'category' => 'seguranca',
            'author' => $staff->id,
            'status' => ArticleStatus::Published->value,
            'sort' => 'title_asc',
        ]))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->component('management/articles/index')
                ->has('articles.data', 1)
                ->where('articles.data.0.id', $matchingArticle->id)
                ->where('filters.author', $staff->id)
                ->where('filters.sort', 'title_asc')
                ->has('filterOptions.authors', 2),
        );

    $this->actingAs($staff)
        ->get(route('management.articles.index', ['sort' => 'title_desc']))
        ->assertOk()
        ->assertInertia(
            fn (Assert $page) => $page
                ->where(
                    'articles.data.0.title',
                    'Um rascunho de segurança',
                ),
        );
});

test('invalid article filters are rejected', function () {
    $staff = User::factory()->staff()->create();

    $this->actingAs($staff)
        ->get(route('management.articles.index', [
            'category' => 'categoria-inexistente',
            'sort' => 'DROP TABLE articles',
        ]))
        ->assertRedirect()
        ->assertSessionHasErrors(['category', 'sort']);
});

test('only administrators can permanently delete articles and their images', function () {
    $staff = User::factory()->staff()->create();
    $administrator = User::factory()->admin()->create();
    $article = Article::factory()->create([
        'cover_image_path' => 'articles/covers/cover.jpg',
        'cover_image_alt' => 'Capa',
    ]);
    $image = ArticleImage::factory()->recycle($article)->create([
        'path' => 'articles/gallery/gallery.jpg',
    ]);
    Storage::disk('article-test')->put($article->cover_image_path, 'cover');
    Storage::disk('article-test')->put($image->path, 'gallery');

    $this->actingAs($staff)
        ->delete(route('management.articles.destroy', $article))
        ->assertForbidden();

    $this->actingAs($administrator)
        ->delete(route('management.articles.destroy', $article))
        ->assertRedirect(route('management.articles.index'));

    $this->assertModelMissing($article);
    Storage::disk('article-test')
        ->assertMissing($article->cover_image_path);
    Storage::disk('article-test')->assertMissing($image->path);
});

test('article uploads and structured blocks are validated', function () {
    $staff = User::factory()->staff()->create();

    $this->actingAs($staff)
        ->post(
            route('management.articles.store'),
            validArticlePayload([
                'blocks' => [
                    ['type' => 'html', 'content' => '<script>alert(1)</script>'],
                ],
                'cover_image' => UploadedFile::fake()->create(
                    'document.pdf',
                    100,
                    'application/pdf',
                ),
            ]),
        )
        ->assertSessionHasErrors([
            'blocks.0.type',
            'cover_image',
        ]);

    expect(Article::query()->count())->toBe(0);
});

/**
 * @param  array<string, mixed>  $overrides
 * @return array<string, mixed>
 */
function validArticlePayload(array $overrides = []): array
{
    return [
        'title' => 'Segurança alimentar nas festas',
        'subtitle' => 'Porque existem regras para os alimentos',
        'excerpt' => 'Conhece os cuidados aplicados durante as festas.',
        'category' => 'seguranca',
        'status' => 'draft',
        'blocks' => [
            [
                'type' => 'paragraph',
                'content' => 'A segurança das crianças começa na preparação.',
            ],
            [
                'type' => 'callout',
                'content' => 'Todos os fornecedores são previamente avaliados.',
            ],
        ],
        'seo_title' => '',
        'seo_description' => '',
        ...$overrides,
    ];
}
