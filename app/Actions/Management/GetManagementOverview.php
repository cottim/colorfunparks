<?php

namespace App\Actions\Management;

use App\Models\NewsletterSubscription;
use App\Models\PartyBooking;
use App\Models\User;
use App\NewsletterSubscriptionStatus;
use App\PartyBookingStatus;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * @phpstan-type ManagedUser array{
 *     id: int,
 *     name: string,
 *     email: string,
 *     role: array{value: string, label: string},
 *     marketing: array{value: string, label: string},
 *     party_bookings_count: int,
 *     created_at: string
 * }
 * @phpstan-type ManagedPartyBooking array{
 *     id: int,
 *     status: array{value: string, label: string},
 *     customer: array{name: string, email: string},
 *     park: string,
 *     child: array{name: string, age: int},
 *     party_date: string,
 *     party_time: string,
 *     guests: int,
 *     program: string,
 *     created_at: string
 * }
 */
class GetManagementOverview
{
    /**
     * @return array{
     *     stats: array{users: int, marketing: int, pending_bookings: int},
     *     users: LengthAwarePaginator<int, ManagedUser>,
     *     party_bookings: LengthAwarePaginator<int, ManagedPartyBooking>
     * }
     */
    public function handle(): array
    {
        $users = User::query()
            ->select(['id', 'name', 'email', 'role', 'created_at'])
            ->with('newsletterSubscription:id,email,status,consented_at,unsubscribed_at')
            ->withCount('partyBookings')
            ->latest('id')
            ->paginate(15, pageName: 'users_page')
            ->withQueryString()
            ->through(fn (User $user): array => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => [
                    'value' => $user->role->value,
                    'label' => $user->role->label(),
                ],
                'marketing' => $this->marketingStatus($user),
                'party_bookings_count' => $user->party_bookings_count,
                'created_at' => $user->created_at?->toISOString(),
            ]);

        $partyBookings = PartyBooking::query()
            ->select([
                'id',
                'user_id',
                'status',
                'park',
                'child_name',
                'child_age',
                'party_date',
                'party_time',
                'guests',
                'program',
                'created_at',
            ])
            ->with('user:id,name,email')
            ->latest('id')
            ->paginate(15, pageName: 'bookings_page')
            ->withQueryString()
            ->through(fn (PartyBooking $partyBooking): array => [
                'id' => $partyBooking->id,
                'status' => [
                    'value' => $partyBooking->status->value,
                    'label' => $partyBooking->status->label(),
                ],
                'customer' => [
                    'name' => $partyBooking->user->name,
                    'email' => $partyBooking->user->email,
                ],
                'park' => $partyBooking->park,
                'child' => [
                    'name' => $partyBooking->child_name,
                    'age' => $partyBooking->child_age,
                ],
                'party_date' => $partyBooking->party_date->toDateString(),
                'party_time' => $partyBooking->party_time,
                'guests' => $partyBooking->guests,
                'program' => $partyBooking->program,
                'created_at' => $partyBooking->created_at?->toISOString(),
            ]);

        return [
            'stats' => [
                'users' => User::query()->count(),
                'marketing' => NewsletterSubscription::query()
                    ->where('status', NewsletterSubscriptionStatus::Confirmed)
                    ->count(),
                'pending_bookings' => PartyBooking::query()
                    ->where('status', PartyBookingStatus::Pending)
                    ->count(),
            ],
            'users' => $users,
            'party_bookings' => $partyBookings,
        ];
    }

    /**
     * @return array{value: string, label: string}
     */
    private function marketingStatus(User $user): array
    {
        $subscription = $user->newsletterSubscription;

        if ($subscription === null) {
            return [
                'value' => 'not_accepted',
                'label' => 'Não aceite',
            ];
        }

        if ($subscription->status === NewsletterSubscriptionStatus::Unsubscribed) {
            return [
                'value' => 'unsubscribed',
                'label' => 'Cancelado',
            ];
        }

        if ($subscription->status === NewsletterSubscriptionStatus::Pending) {
            return [
                'value' => 'pending',
                'label' => 'Por confirmar',
            ];
        }

        return [
            'value' => 'accepted',
            'label' => 'Aceite',
        ];
    }
}
