<?php

namespace App\Models;

use Database\Factories\CustomerLoginLinkFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\MassPrunable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $email
 * @property string $token_hash
 * @property Carbon $expires_at
 * @property Carbon|null $used_at
 * @property Carbon|null $privacy_accepted_at
 * @property Carbon|null $terms_accepted_at
 * @property string|null $legal_consent_version
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'email',
    'token_hash',
    'expires_at',
    'used_at',
    'privacy_accepted_at',
    'terms_accepted_at',
    'legal_consent_version',
])]
class CustomerLoginLink extends Model
{
    /** @use HasFactory<CustomerLoginLinkFactory> */
    use HasFactory, MassPrunable;

    /**
     * @return Builder<static>
     */
    public function prunable(): Builder
    {
        return static::query()->where(function (Builder $query): void {
            $query
                ->where('expires_at', '<', now()->subDay())
                ->orWhere('used_at', '<', now()->subDay());
        });
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'used_at' => 'datetime',
            'privacy_accepted_at' => 'datetime',
            'terms_accepted_at' => 'datetime',
        ];
    }
}
