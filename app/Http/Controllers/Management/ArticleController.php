<?php

namespace App\Http\Controllers\Management;

use App\Actions\Article\DeleteArticle;
use App\Actions\Article\PresentArticle;
use App\Actions\Article\SaveArticle;
use App\ArticleSort;
use App\ArticleStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\FilterArticlesRequest;
use App\Http\Requests\StoreArticleRequest;
use App\Http\Requests\UpdateArticleRequest;
use App\Models\Article;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    public function index(
        FilterArticlesRequest $request,
        PresentArticle $presentArticle,
    ): Response {
        $filters = $request->filters();

        $articles = Article::query()
            ->with('author:id,name')
            ->when(
                $filters['query'],
                fn (Builder $query, string $search): Builder => $query
                    ->where(
                        fn (Builder $query): Builder => $query
                            ->where('title', 'like', "%{$search}%")
                            ->orWhere('subtitle', 'like', "%{$search}%")
                            ->orWhere('excerpt', 'like', "%{$search}%"),
                    ),
            )
            ->when(
                $filters['category'],
                fn (Builder $query, string $category): Builder => $query
                    ->where('category', $category),
            )
            ->when(
                $filters['author'],
                fn (Builder $query, int $author): Builder => $query
                    ->where('author_id', $author),
            )
            ->when(
                $filters['status'],
                fn (Builder $query, string $status): Builder => $query
                    ->where('status', $status),
            )
            ->orderBy(
                $filters['sort']->column(),
                $filters['sort']->direction(),
            )
            ->orderBy('id', $filters['sort']->direction())
            ->paginate(20)
            ->withQueryString()
            ->through($presentArticle->management(...))
            ->toArray();

        return Inertia::render('management/articles/index', [
            'articles' => $articles,
            'filters' => [
                ...$filters,
                'sort' => $filters['sort']->value,
            ],
            'filterOptions' => $this->filterOptions(),
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', Article::class);

        return Inertia::render('management/articles/create', [
            'options' => $this->options(),
        ]);
    }

    public function store(
        StoreArticleRequest $request,
        SaveArticle $saveArticle,
    ): RedirectResponse {
        $article = $saveArticle->handle(
            null,
            $request->author(),
            $request->articleData(),
            $request->file('cover_image'),
            $request->galleryUploads(),
        );

        return to_route('management.articles.edit', $article)
            ->with('success', 'O artigo foi criado.');
    }

    public function edit(
        Article $article,
        PresentArticle $presentArticle,
    ): Response {
        Gate::authorize('update', $article);
        $article->load(['author:id,name', 'images']);

        return Inertia::render('management/articles/edit', [
            'article' => $presentArticle->detail($article),
            'options' => $this->options(),
            'permissions' => [
                'delete' => Gate::allows('delete', $article),
            ],
        ]);
    }

    public function update(
        UpdateArticleRequest $request,
        Article $article,
        SaveArticle $saveArticle,
    ): RedirectResponse {
        $saveArticle->handle(
            $article,
            $request->author(),
            $request->articleData(),
            $request->file('cover_image'),
            $request->galleryUploads(),
            $request->boolean('remove_cover'),
            $request->galleryImageIdsToRemove(),
        );

        return back()->with('success', 'O artigo foi atualizado.');
    }

    public function destroy(
        Article $article,
        DeleteArticle $deleteArticle,
    ): RedirectResponse {
        Gate::authorize('delete', $article);
        $deleteArticle->handle($article);

        return to_route('management.articles.index')
            ->with('success', 'O artigo foi eliminado.');
    }

    /**
     * @return array<string, mixed>
     */
    private function options(): array
    {
        return [
            'categories' => config('content.categories'),
            'blockTypes' => config('content.block_types'),
            'statuses' => collect(ArticleStatus::cases())
                ->map(fn (ArticleStatus $status): array => [
                    'value' => $status->value,
                    'label' => $status->label(),
                ])
                ->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function filterOptions(): array
    {
        return [
            'categories' => config('content.categories'),
            'authors' => User::query()
                ->select(['id', 'name'])
                ->whereIn(
                    'id',
                    Article::query()
                        ->select('author_id')
                        ->whereNotNull('author_id'),
                )
                ->orderBy('name')
                ->get()
                ->map(fn (User $user): array => [
                    'value' => $user->id,
                    'label' => $user->name,
                ])
                ->all(),
            'statuses' => collect(ArticleStatus::cases())
                ->map(fn (ArticleStatus $status): array => [
                    'value' => $status->value,
                    'label' => $status->label(),
                ])
                ->all(),
            'sorts' => collect(ArticleSort::cases())
                ->map(fn (ArticleSort $sort): array => [
                    'value' => $sort->value,
                    'label' => $sort->label(),
                ])
                ->all(),
        ];
    }
}
