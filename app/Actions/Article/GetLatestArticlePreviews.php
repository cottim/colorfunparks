<?php

namespace App\Actions\Article;

use App\Models\Article;

class GetLatestArticlePreviews
{
    public function __construct(private PresentArticle $presentArticle) {}

    /**
     * @return array<int, array<string, mixed>>
     */
    public function handle(int $limit): array
    {
        return Article::query()
            ->published()
            ->latest('published_at')
            ->limit($limit)
            ->get()
            ->map($this->presentArticle->preview(...))
            ->all();
    }
}
