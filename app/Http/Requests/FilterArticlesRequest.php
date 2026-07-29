<?php

namespace App\Http\Requests;

use App\ArticleSort;
use App\ArticleStatus;
use App\Models\Article;
use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FilterArticlesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('viewAny', Article::class) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'query' => ['nullable', 'string', 'max:100'],
            'category' => [
                'nullable',
                'string',
                Rule::in($this->configuredCategoryValues()),
            ],
            'author' => [
                'nullable',
                'integer',
                Rule::exists((new User)->getTable(), 'id'),
            ],
            'status' => [
                'nullable',
                'string',
                Rule::enum(ArticleStatus::class),
            ],
            'sort' => [
                'nullable',
                'string',
                Rule::enum(ArticleSort::class),
            ],
        ];
    }

    /**
     * @return array{
     *     query: string|null,
     *     category: string|null,
     *     author: int|null,
     *     status: string|null,
     *     sort: ArticleSort
     * }
     */
    public function filters(): array
    {
        $query = $this->validated('query');
        $category = $this->validated('category');
        $author = $this->validated('author');
        $status = $this->validated('status');
        $sort = $this->validated('sort');

        return [
            'query' => is_string($query) && $query !== '' ? $query : null,
            'category' => is_string($category) ? $category : null,
            'author' => is_numeric($author) ? (int) $author : null,
            'status' => is_string($status) ? $status : null,
            'sort' => is_string($sort)
                ? ArticleSort::from($sort)
                : ArticleSort::UpdatedDesc,
        ];
    }

    /**
     * @return array<int, string>
     */
    private function configuredCategoryValues(): array
    {
        $categories = config('content.categories', []);

        if (! is_array($categories)) {
            return [];
        }

        return collect($categories)
            ->filter(
                fn (mixed $category): bool => is_array($category)
                    && is_string($category['value'] ?? null),
            )
            ->map(
                fn (array $category): string => $category['value'],
            )
            ->values()
            ->all();
    }
}
