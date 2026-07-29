<?php

namespace App\Actions\Article;

use App\ArticleStatus;
use App\Models\Article;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;
use Throwable;

class SaveArticle
{
    /**
     * @param  array<string, mixed>  $data
     * @param  array<int, array{file: UploadedFile, alt_text: string}>  $galleryUploads
     * @param  array<int, int>  $galleryImageIdsToRemove
     */
    public function handle(
        ?Article $article,
        User $author,
        array $data,
        ?UploadedFile $coverImage,
        array $galleryUploads,
        bool $removeCover = false,
        array $galleryImageIdsToRemove = [],
    ): Article {
        $disk = (string) config('content.media_disk');
        $newPaths = [];
        $pathsToDelete = [];

        try {
            $newCoverPath = $coverImage?->store(
                'articles/covers',
                $disk,
            );

            if ($newCoverPath === false) {
                throw new RuntimeException('Não foi possível guardar a capa.');
            }

            if (is_string($newCoverPath)) {
                $newPaths[] = $newCoverPath;
            }

            $storedGallery = collect($galleryUploads)
                ->map(function (array $upload) use (
                    $disk,
                    &$newPaths,
                ): array {
                    $path = $upload['file']->store(
                        'articles/gallery',
                        $disk,
                    );

                    if ($path === false) {
                        throw new RuntimeException(
                            'Não foi possível guardar uma imagem da galeria.',
                        );
                    }

                    $newPaths[] = $path;

                    return [
                        'path' => $path,
                        'alt_text' => $upload['alt_text'],
                    ];
                })
                ->all();

            $savedArticle = DB::transaction(function () use (
                $article,
                $author,
                $data,
                $newCoverPath,
                $removeCover,
                $galleryImageIdsToRemove,
                $storedGallery,
                &$pathsToDelete,
            ): Article {
                $article ??= new Article([
                    'author_id' => $author->id,
                    'slug' => $this->uniqueSlug((string) $data['title']),
                ]);

                $status = ArticleStatus::from((string) $data['status']);
                $attributes = [
                    ...$data,
                    'published_at' => $status === ArticleStatus::Published
                        ? ($article->published_at ?? now())
                        : null,
                ];

                if (is_string($newCoverPath)) {
                    if ($article->cover_image_path !== null) {
                        $pathsToDelete[] = $article->cover_image_path;
                    }

                    $attributes['cover_image_path'] = $newCoverPath;
                } elseif ($removeCover) {
                    if ($article->cover_image_path !== null) {
                        $pathsToDelete[] = $article->cover_image_path;
                    }

                    $attributes['cover_image_path'] = null;
                    $attributes['cover_image_alt'] = null;
                } elseif ($article->cover_image_path === null) {
                    $attributes['cover_image_alt'] = null;
                }

                $article->fill($attributes);
                $article->save();

                $imagesToRemove = $article->images()
                    ->whereKey($galleryImageIdsToRemove)
                    ->get();
                $pathsToDelete = [
                    ...$pathsToDelete,
                    ...$imagesToRemove->pluck('path')->all(),
                ];
                $imagesToRemove->each->delete();

                $position = (int) $article->images()->max('position');

                foreach ($storedGallery as $image) {
                    $article->images()->create([
                        ...$image,
                        'position' => ++$position,
                    ]);
                }

                return $article->fresh(['author:id,name', 'images']);
            });
        } catch (Throwable $throwable) {
            Storage::disk($disk)->delete($newPaths);

            throw $throwable;
        }

        Storage::disk($disk)->delete(array_unique($pathsToDelete));

        return $savedArticle;
    }

    private function uniqueSlug(string $title): string
    {
        $baseSlug = Str::slug($title) ?: 'artigo';
        $slug = $baseSlug;
        $suffix = 2;

        while (Article::query()->where('slug', $slug)->exists()) {
            $slug = "{$baseSlug}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }
}
