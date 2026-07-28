<?php

namespace App\Actions\Management;

use App\Models\NewsletterSubscription;
use App\Models\PartyBooking;
use App\Models\User;
use App\NewsletterSubscriptionStatus;
use App\PartyBookingStatus;
use App\UserRole;

class GetDashboard
{
    /**
     * @return array{
     *     stats: array{
     *         pending_bookings: int,
     *         upcoming_bookings: int,
     *         customers: int,
     *         marketing: int
     *     },
     *     recent_bookings: array<int, array{
     *         id: int,
     *         reference: string,
     *         customer_name: string,
     *         child_name: string,
     *         party_date: string,
     *         party_time: string,
     *         status: array{value: string, label: string}
     *     }>
     * }
     */
    public function handle(): array
    {
        $recentBookings = PartyBooking::query()
            ->select([
                'id',
                'user_id',
                'status',
                'child_name',
                'party_date',
                'party_time',
                'contact_name',
            ])
            ->with('user:id,name')
            ->latest('id')
            ->limit(5)
            ->get()
            ->map(function (PartyBooking $partyBooking): array {
                $customer = $partyBooking->getRelation('user');
                $customerName = $customer instanceof User
                    ? $customer->name
                    : null;

                return [
                    'id' => $partyBooking->id,
                    'reference' => $partyBooking->reference(),
                    'customer_name' => $partyBooking->contact_name
                        ?? $customerName
                        ?? 'Sem nome',
                    'child_name' => $partyBooking->child_name,
                    'party_date' => $partyBooking->party_date->toDateString(),
                    'party_time' => $partyBooking->party_time,
                    'status' => [
                        'value' => $partyBooking->status->value,
                        'label' => $partyBooking->status->label(),
                    ],
                ];
            })
            ->all();

        return [
            'stats' => [
                'pending_bookings' => PartyBooking::query()
                    ->where('status', PartyBookingStatus::Pending)
                    ->count(),
                'upcoming_bookings' => PartyBooking::query()
                    ->whereDate('party_date', '>=', today())
                    ->count(),
                'customers' => User::query()
                    ->where('role', UserRole::Customer)
                    ->count(),
                'marketing' => NewsletterSubscription::query()
                    ->where('status', NewsletterSubscriptionStatus::Confirmed)
                    ->count(),
            ],
            'recent_bookings' => $recentBookings,
        ];
    }
}
