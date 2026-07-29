<?php

namespace App\Http\Controllers;

use App\Actions\Article\PresentArticle;
use App\Models\Article;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    public function index(PresentArticle $presentArticle): Response
    {
        $articles = Article::query()
            ->published()
            ->latest('published_at')
            ->paginate(9)
            ->withQueryString()
            ->through($presentArticle->preview(...))
            ->toArray();

        return Inertia::render('articles/index', [
            'articles' => $articles,
        ]);
    }

    public function show(
        Article $article,
        PresentArticle $presentArticle,
    ): Response {
        abort_unless($article->isPubliclyVisible(), 404);
        $article->load(['author:id,name', 'images']);

        return Inertia::render('articles/show', [
            'article' => $presentArticle->detail($article),
        ]);
    }
}
