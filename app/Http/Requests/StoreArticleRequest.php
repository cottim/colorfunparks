<?php

namespace App\Http\Requests;

use App\ArticleStatus;
use App\Models\Article;
use App\Models\User;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreArticleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Article::class) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $categories = $this->configuredValues('content.categories');
        $blockTypes = $this->configuredValues('content.block_types');

        return [
            'title' => ['required', 'string', 'max:160'],
            'subtitle' => ['nullable', 'string', 'max:220'],
            'excerpt' => ['required', 'string', 'max:500'],
            'category' => ['required', 'string', Rule::in($categories)],
            'status' => ['required', 'string', Rule::enum(ArticleStatus::class)],
            'blocks' => ['required', 'array', 'min:1', 'max:40'],
            'blocks.*.type' => [
                'required',
                'string',
                Rule::in($blockTypes),
            ],
            'blocks.*.content' => ['required', 'string', 'max:5000'],
            'seo_title' => ['nullable', 'string', 'max:70'],
            'seo_description' => ['nullable', 'string', 'max:170'],
            'cover_image' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'mimetypes:image/jpeg,image/png,image/webp',
                'max:5120',
            ],
            'cover_image_alt' => ['nullable', 'string', 'max:255'],
            'gallery' => ['nullable', 'array', 'max:12'],
            'gallery.*' => [
                'required',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'mimetypes:image/jpeg,image/png,image/webp',
                'max:5120',
            ],
            'gallery_alt_texts' => ['nullable', 'array', 'max:12'],
            'gallery_alt_texts.*' => [
                'required',
                'string',
                'max:255',
            ],
        ];
    }

    /**
     * @return array<int, Closure(Validator): void>
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $article = $this->route('article');
                $hasExistingCover = $article instanceof Article
                    && $article->cover_image_path !== null
                    && ! $this->boolean('remove_cover');

                if (
                    ($this->hasFile('cover_image') || $hasExistingCover)
                    && $this->string('cover_image_alt')->trim()->isEmpty()
                ) {
                    $validator->errors()->add(
                        'cover_image_alt',
                        'Descreve a imagem de capa.',
                    );
                }

                $gallery = $this->file('gallery', []);
                $altTexts = $this->input('gallery_alt_texts', []);

                if (
                    is_array($gallery)
                    && count($gallery) !== count(Arr::wrap($altTexts))
                ) {
                    $validator->errors()->add(
                        'gallery_alt_texts',
                        'Cada imagem da galeria precisa de uma descrição.',
                    );
                }
            },
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function articleData(): array
    {
        $data = Arr::only($this->validated(), [
            'title',
            'subtitle',
            'excerpt',
            'category',
            'status',
            'blocks',
            'seo_title',
            'seo_description',
            'cover_image_alt',
        ]);
        $blocks = $data['blocks'] ?? [];
        $data['blocks'] = is_array($blocks)
            ? collect($blocks)
                ->filter(fn (mixed $block): bool => is_array($block))
                ->map(
                    fn (array $block): array => Arr::only(
                        $block,
                        ['type', 'content'],
                    ),
                )
                ->all()
            : [];

        return $data;
    }

    public function author(): User
    {
        $user = $this->user();

        abort_unless($user instanceof User, 403);

        return $user;
    }

    /**
     * @return array<int, array{file: UploadedFile, alt_text: string}>
     */
    public function galleryUploads(): array
    {
        $files = $this->file('gallery', []);
        $altTexts = Arr::wrap($this->input('gallery_alt_texts', []));

        if (! is_array($files)) {
            return [];
        }

        return collect($files)
            ->values()
            ->map(
                fn (UploadedFile $file, int $index): array => [
                    'file' => $file,
                    'alt_text' => (string) ($altTexts[$index] ?? ''),
                ],
            )
            ->all();
    }

    /**
     * @return array<int, string>
     */
    private function configuredValues(string $key): array
    {
        $options = config($key, []);

        if (! is_array($options)) {
            return [];
        }

        return collect($options)
            ->filter(
                fn (mixed $option): bool => is_array($option)
                    && isset($option['value'])
                    && is_string($option['value']),
            )
            ->map(
                fn (array $option): string => $option['value'],
            )
            ->values()
            ->all();
    }
}
