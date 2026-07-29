<?php

namespace App\Actions\Article;

use App\Models\Article;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PresentArticle
{
    /**
     * @return array<string, mixed>
     */
    public function preview(Article $article): array
    {
        return [
            'id' => $article->id,
            'slug' => $article->slug,
            'category' => $this->categoryLabel($article->category),
            'title' => $article->title,
            'subtitle' => $article->subtitle,
            'excerpt' => $article->excerpt,
            'coverImageUrl' => $this->imageUrl(
                $article->cover_image_path,
            ),
            'coverImageAlt' => $article->cover_image_alt,
            'publishedAt' => $article->published_at?->toISOString(),
            'readingTime' => $this->readingTime($article),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function management(Article $article): array
    {
        $author = $article->getRelation('author');

        return [
            ...$this->preview($article),
            'status' => [
                'value' => $article->status->value,
                'label' => $article->status->label(),
            ],
            'author' => $author instanceof User
                ? ['name' => $author->name]
                : ['name' => 'Utilizador removido'],
            'updatedAt' => $article->updated_at?->toISOString(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function detail(Article $article): array
    {
        return [
            ...$this->management($article),
            'categoryValue' => $article->category,
            'blocks' => $article->blocks,
            'seoTitle' => $article->seo_title,
            'seoDescription' => $article->seo_description,
            'images' => $article->images->map(
                fn ($image): array => [
                    'id' => $image->id,
                    'url' => $this->imageUrl($image->path),
                    'altText' => $image->alt_text,
                    'caption' => $image->caption,
                ],
            )->all(),
        ];
    }

    private function categoryLabel(string $category): string
    {
        $categories = config('content.categories', []);

        if (! is_array($categories)) {
            return $category;
        }

        foreach ($categories as $option) {
            if (
                is_array($option)
                && ($option['value'] ?? null) === $category
                && is_string($option['label'] ?? null)
            ) {
                return $option['label'];
            }
        }

        return $category;
    }

    private function imageUrl(?string $path): ?string
    {
        if ($path === null) {
            return null;
        }

        $url = Storage::disk((string) config('content.media_disk'))
            ->url($path);

        return Str::startsWith($url, ['http://', 'https://'])
            ? $url
            : url($url);
    }

    private function readingTime(Article $article): int
    {
        $content = collect($article->blocks)
            ->pluck('content')
            ->implode(' ');
        preg_match_all('/\p{L}+/u', $content, $matches);

        return max(1, (int) ceil(count($matches[0]) / 200));
    }
}
