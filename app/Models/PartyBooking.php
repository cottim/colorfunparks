<?php

namespace App\Models;

use App\PartyBookingStatus;
use Database\Factories\PartyBookingFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int|null $user_id
 * @property PartyBookingStatus $status
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
    use HasFactory;

    protected $attributes = [
        'status' => PartyBookingStatus::Pending->value,
    ];

    public function partyNumber(): int
    {
        return 1000 + (int) $this->getKey();
    }

    public function reference(): string
    {
        return 'CFP'.$this->partyNumber();
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
            'party_date' => 'date',
            'program_choices' => 'array',
            'privacy_accepted_at' => 'datetime',
            'terms_accepted_at' => 'datetime',
        ];
    }
}
