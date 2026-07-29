<?php

namespace App\Models;

use App\ArticleStatus;
use Database\Factories\ArticleFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int|null $author_id
 * @property string $title
 * @property string|null $subtitle
 * @property string $slug
 * @property string $excerpt
 * @property string $category
 * @property ArticleStatus $status
 * @property string|null $cover_image_path
 * @property string|null $cover_image_alt
 * @property array<int, array{type: string, content: string}> $blocks
 * @property string|null $seo_title
 * @property string|null $seo_description
 * @property Carbon|null $published_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User|null $author
 * @property-read Collection<int, ArticleImage> $images
 */
#[Fillable([
    'author_id',
    'title',
    'subtitle',
    'slug',
    'excerpt',
    'category',
    'status',
    'cover_image_path',
    'cover_image_alt',
    'blocks',
    'seo_title',
    'seo_description',
    'published_at',
])]
class Article extends Model
{
    /** @use HasFactory<ArticleFactory> */
    use HasFactory;

    protected $attributes = [
        'status' => ArticleStatus::Draft->value,
    ];

    /**
     * @return BelongsTo<User, $this>
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * @return HasMany<ArticleImage, $this>
     */
    public function images(): HasMany
    {
        return $this->hasMany(ArticleImage::class)
            ->orderBy('position')
            ->orderBy('id');
    }

    /**
     * @param  Builder<Article>  $query
     * @return Builder<Article>
     */
    public function scopePublished(Builder $query): Builder
    {
        return $query
            ->where('status', ArticleStatus::Published)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    public function isPubliclyVisible(): bool
    {
        return $this->status === ArticleStatus::Published
            && $this->published_at !== null
            && $this->published_at->isPast();
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => ArticleStatus::class,
            'blocks' => 'array',
            'published_at' => 'datetime',
        ];
    }
}
