<?php

namespace App\Http\Requests;

use App\Models\Article;
use App\Models\ArticleImage;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

class UpdateArticleRequest extends StoreArticleRequest
{
    public function authorize(): bool
    {
        $article = $this->route('article');

        return $article instanceof Article
            && ($this->user()?->can('update', $article) ?? false);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $article = $this->route('article');
        $articleId = $article instanceof Article ? $article->id : 0;

        return [
            ...parent::rules(),
            'remove_cover' => ['sometimes', 'boolean'],
            'remove_gallery_image_ids' => [
                'sometimes',
                'array',
                'max:12',
            ],
            'remove_gallery_image_ids.*' => [
                'integer',
                Rule::exists(
                    (new ArticleImage)->getTable(),
                    'id',
                )->where('article_id', $articleId),
            ],
        ];
    }

    /**
     * @return array<int, int>
     */
    public function galleryImageIdsToRemove(): array
    {
        $imageIds = $this->validated('remove_gallery_image_ids', []);

        if (! is_array($imageIds)) {
            return [];
        }

        return collect($imageIds)
            ->map(fn (mixed $id): int => (int) $id)
            ->all();
    }
}
