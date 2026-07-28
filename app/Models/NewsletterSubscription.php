<?php

namespace App\Models;

use App\NewsletterSubscriptionStatus;
use Database\Factories\NewsletterSubscriptionFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\MassPrunable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $email
 * @property NewsletterSubscriptionStatus $status
 * @property Carbon $consented_at
 * @property string|null $confirmation_token_hash
 * @property Carbon|null $confirmation_sent_at
 * @property Carbon|null $confirmed_at
 * @property Carbon|null $unsubscribed_at
 * @property string $consent_version
 * @property string $source
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'email',
    'status',
    'consented_at',
    'confirmation_token_hash',
    'confirmation_sent_at',
    'confirmed_at',
    'unsubscribed_at',
    'consent_version',
    'source',
])]
class NewsletterSubscription extends Model
{
    public const CONSENT_VERSION = 'v1';

    public const HOMEPAGE_SOURCE = 'homepage';

    public const CUSTOMER_ACCOUNT_SOURCE = 'customer-account';

    /** @use HasFactory<NewsletterSubscriptionFactory> */
    use HasFactory, MassPrunable;

    protected $attributes = [
        'status' => NewsletterSubscriptionStatus::Pending->value,
    ];

    /**
     * @return Builder<static>
     */
    public function prunable(): Builder
    {
        return static::query()
            ->where('status', NewsletterSubscriptionStatus::Pending)
            ->where(
                'confirmation_sent_at',
                '<=',
                now()->subDays(
                    (int) config('newsletter.pending_retention_days'),
                ),
            );
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => NewsletterSubscriptionStatus::class,
            'consented_at' => 'datetime',
            'confirmation_sent_at' => 'datetime',
            'confirmed_at' => 'datetime',
            'unsubscribed_at' => 'datetime',
        ];
    }
}
