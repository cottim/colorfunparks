<?php

namespace App\Models;

use Database\Factories\ArticleImageFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $article_id
 * @property string $path
 * @property string $alt_text
 * @property string|null $caption
 * @property int $position
 * @property-read Article $article
 */
#[Fillable([
    'article_id',
    'path',
    'alt_text',
    'caption',
    'position',
])]
class ArticleImage extends Model
{
    /** @use HasFactory<ArticleImageFactory> */
    use HasFactory;

    /**
     * @return BelongsTo<Article, $this>
     */
    public function article(): BelongsTo
    {
        return $this->belongsTo(Article::class);
    }
}
