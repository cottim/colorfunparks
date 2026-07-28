<?php

namespace App\Models;

use App\ColorCampRegistrationStatus;
use Database\Factories\ColorCampRegistrationFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int|null $user_id
 * @property ColorCampRegistrationStatus $status
 * @property string|null $contact_name
 * @property string|null $contact_email
 * @property string $contact_phone
 * @property string $child_name
 * @property Carbon $child_birth_date
 * @property string|null $allergies_and_health_notes
 * @property string $authorized_pickup_name
 * @property string $authorized_pickup_phone
 * @property string $attendance_type
 * @property list<string>|null $selected_weeks
 * @property list<string>|null $selected_days
 * @property string $lunch_option
 * @property string|null $discount
 * @property bool $needs_extended_care
 * @property bool $trip_authorized
 * @property string $photo_consent
 * @property string|null $notes
 * @property Carbon $privacy_accepted_at
 * @property Carbon $terms_accepted_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User|null $user
 */
#[Fillable([
    'user_id',
    'status',
    'contact_name',
    'contact_email',
    'contact_phone',
    'child_name',
    'child_birth_date',
    'allergies_and_health_notes',
    'authorized_pickup_name',
    'authorized_pickup_phone',
    'attendance_type',
    'selected_weeks',
    'selected_days',
    'lunch_option',
    'discount',
    'needs_extended_care',
    'trip_authorized',
    'photo_consent',
    'notes',
    'privacy_accepted_at',
    'terms_accepted_at',
])]
class ColorCampRegistration extends Model
{
    /** @use HasFactory<ColorCampRegistrationFactory> */
    use HasFactory;

    protected $attributes = [
        'status' => ColorCampRegistrationStatus::Pending->value,
        'needs_extended_care' => false,
    ];

    public function reference(): string
    {
        return 'CFC'.(1000 + (int) $this->getKey());
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => ColorCampRegistrationStatus::class,
            'child_birth_date' => 'date',
            'allergies_and_health_notes' => 'encrypted',
            'selected_weeks' => 'array',
            'selected_days' => 'array',
            'needs_extended_care' => 'boolean',
            'trip_authorized' => 'boolean',
            'notes' => 'encrypted',
            'privacy_accepted_at' => 'datetime',
            'terms_accepted_at' => 'datetime',
        ];
    }
}
