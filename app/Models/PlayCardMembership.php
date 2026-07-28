<?php

namespace App\Models;

use App\PlayCardStatus;
use Carbon\CarbonInterface;
use Database\Factories\PlayCardMembershipFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $user_id
 * @property CarbonInterface $joined_at
 * @property CarbonInterface|null $last_used_at
 * @property CarbonInterface|null $deactivated_at
 * @property CarbonInterface|null $created_at
 * @property CarbonInterface|null $updated_at
 * @property-read User $user
 */
#[Fillable(['user_id', 'joined_at', 'last_used_at', 'deactivated_at'])]
class PlayCardMembership extends Model
{
    /** @use HasFactory<PlayCardMembershipFactory> */
    use HasFactory;

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function status(): PlayCardStatus
    {
        if ($this->deactivated_at !== null) {
            return PlayCardStatus::Inactive;
        }

        if ($this->benefitsActiveUntil()->greaterThanOrEqualTo(now())) {
            return PlayCardStatus::PromotionUnlocked;
        }

        return PlayCardStatus::Active;
    }

    public function benefitsActivatedAt(): CarbonInterface
    {
        if ($this->last_used_at?->greaterThan($this->joined_at)) {
            return $this->last_used_at;
        }

        return $this->joined_at;
    }

    public function benefitsActiveUntil(): CarbonInterface
    {
        return $this->benefitsActivatedAt()->copy()->addDays(30);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'joined_at' => 'datetime',
            'last_used_at' => 'datetime',
            'deactivated_at' => 'datetime',
        ];
    }
}
