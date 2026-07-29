<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\NewsletterSubscriptionStatus;
use App\Observers\UserObserver;
use App\UserRole;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property UserRole $role
 * @property Carbon|null $email_verified_at
 * @property Carbon|null $privacy_accepted_at
 * @property Carbon|null $terms_accepted_at
 * @property string|null $legal_consent_version
 * @property string $password
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read NewsletterSubscription|null $newsletterSubscription
 * @property-read PendingEmailChange|null $pendingEmailChange
 * @property-read PlayCardMembership|null $playCardMembership
 * @property-read Collection<int, ColorCampRegistration> $colorCampRegistrations
 * @property-read Collection<int, PartyBooking> $partyBookings
 * @property-read Collection<int, Article> $articles
 * @property-read Collection<int, StaffInvitation> $staffInvitations
 */
#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
#[ObservedBy([UserObserver::class])]
class User extends Authenticatable implements PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    public const string LEGAL_CONSENT_VERSION = 'v1';

    protected $attributes = [
        'role' => UserRole::Customer->value,
    ];

    /**
     * @return HasOne<NewsletterSubscription, $this>
     */
    public function newsletterSubscription(): HasOne
    {
        return $this->hasOne(
            NewsletterSubscription::class,
            'email',
            'email',
        );
    }

    /**
     * @return HasOne<PendingEmailChange, $this>
     */
    public function pendingEmailChange(): HasOne
    {
        return $this->hasOne(PendingEmailChange::class);
    }

    /**
     * @return HasOne<PlayCardMembership, $this>
     */
    public function playCardMembership(): HasOne
    {
        return $this->hasOne(PlayCardMembership::class);
    }

    /**
     * @return HasMany<PartyBooking, $this>
     */
    public function partyBookings(): HasMany
    {
        return $this->hasMany(PartyBooking::class);
    }

    /**
     * @return HasMany<Article, $this>
     */
    public function articles(): HasMany
    {
        return $this->hasMany(Article::class, 'author_id');
    }

    /**
     * @return HasMany<ColorCampRegistration, $this>
     */
    public function colorCampRegistrations(): HasMany
    {
        return $this->hasMany(ColorCampRegistration::class);
    }

    /**
     * @return HasMany<StaffInvitation, $this>
     */
    public function staffInvitations(): HasMany
    {
        return $this->hasMany(StaffInvitation::class, 'invited_by_id');
    }

    public function canAccessManagement(): bool
    {
        return $this->role->canAccessManagement();
    }

    public function hasAcceptedCurrentLegalConsent(): bool
    {
        return $this->privacy_accepted_at !== null
            && $this->terms_accepted_at !== null
            && $this->legal_consent_version === self::LEGAL_CONSENT_VERSION;
    }

    public function hasAuthorizedMarketing(): bool
    {
        return $this->newsletterSubscription()
            ->where('status', NewsletterSubscriptionStatus::Confirmed)
            ->whereNull('unsubscribed_at')
            ->exists();
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'privacy_accepted_at' => 'datetime',
            'terms_accepted_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
            'two_factor_confirmed_at' => 'datetime',
        ];
    }
}
