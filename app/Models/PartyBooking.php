<?php

namespace App\Models;

use App\PartyBookingStatus;
use Database\Factories\PartyBookingFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\MassPrunable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property int|null $user_id
 * @property PartyBookingStatus $status
 * @property Carbon|null $archived_at
 * @property string|null $reference_code
 * @property string $park
 * @property string $child_name
 * @property int $child_age
 * @property Carbon $party_date
 * @property string $party_time
 * @property int $guests
 * @property string $program
 * @property array<string, array{group: string, value: string, label: string}>|null $program_choices
 * @property string|null $contact_name
 * @property string|null $contact_email
 * @property string|null $contact_phone
 * @property Carbon $privacy_accepted_at
 * @property Carbon $terms_accepted_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User|null $user
 */
#[Fillable([
    'user_id',
    'status',
    'archived_at',
    'park',
    'child_name',
    'child_age',
    'party_date',
    'party_time',
    'guests',
    'program',
    'program_choices',
    'contact_name',
    'contact_email',
    'contact_phone',
    'privacy_accepted_at',
    'terms_accepted_at',
])]
class PartyBooking extends Model
{
    /** @use HasFactory<PartyBookingFactory> */
    use HasFactory, MassPrunable;

    protected $attributes = [
        'status' => PartyBookingStatus::Pending->value,
    ];

    protected static function booted(): void
    {
        static::creating(function (PartyBooking $booking): void {
            $booking->reference_code ??= 'CFP-'.Str::upper(
                Str::random(10),
            );
        });
    }

    public function partyNumber(): int
    {
        return 1000 + (int) $this->getKey();
    }

    public function reference(): string
    {
        return $this->reference_code ?? 'CFP'.$this->partyNumber();
    }

    /**
     * @return Builder<PartyBooking>
     */
    public function prunable(): Builder
    {
        return self::query()->whereDate(
            'party_date',
            '<=',
            today()->subDays(
                (int) config('privacy.retention_days.party_bookings'),
            ),
        );
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => PartyBookingStatus::class,
            'archived_at' => 'datetime',
            'party_date' => 'date',
            'program_choices' => 'array',
            'privacy_accepted_at' => 'datetime',
            'terms_accepted_at' => 'datetime',
        ];
    }
}
