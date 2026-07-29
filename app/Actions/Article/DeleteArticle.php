<?php

namespace App\Actions\Article;

use App\Models\Article;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class DeleteArticle
{
    public function handle(Article $article): void
    {
        $article->loadMissing('images');
        $paths = $article->images->pluck('path');

        if ($article->cover_image_path !== null) {
            $paths->push($article->cover_image_path);
        }

        DB::transaction(fn () => $article->delete());

        Storage::disk((string) config('content.media_disk'))
            ->delete($paths->unique()->values()->all());
    }
}
