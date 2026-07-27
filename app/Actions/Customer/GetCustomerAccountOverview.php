<?php

namespace App\Actions\Customer;

use App\Models\User;
use App\PartyBookingStatus;

class GetCustomerAccountOverview
{
    public function __construct(
        private PresentCustomerPartyBooking $presentCustomerPartyBooking,
    ) {}

    /**
     * @return array{
     *     openBookings: list<array{
     *         id: int,
     *         status: string,
     *         statusLabel: string,
     *         park: string,
     *         childName: string,
     *         childAge: int,
     *         partyDate: string,
     *         partyTime: string,
     *         guests: int,
     *         program: string|null,
     *         contactName: string,
     *         contactEmail: string|null,
     *         contactPhone: string|null,
     *         createdAt: string
     *     }>,
     *     recentBookings: list<array{
     *         id: int,
     *         status: string,
     *         statusLabel: string,
     *         park: string,
     *         childName: string,
     *         childAge: int,
     *         partyDate: string,
     *         partyTime: string,
     *         guests: int,
     *         program: string|null,
     *         contactName: string,
     *         contactEmail: string|null,
     *         contactPhone: string|null,
     *         createdAt: string
     *     }>
     * }
     */
    public function handle(User $user): array
    {
        $openStatuses = [
            PartyBookingStatus::Pending,
            PartyBookingStatus::Contacted,
            PartyBookingStatus::Confirmed,
        ];

        $openBookings = array_values(
            $user->partyBookings()
                ->with('user:id,name,email')
                ->whereIn('status', $openStatuses)
                ->orderBy('party_date')
                ->limit(3)
                ->get()
                ->map($this->presentCustomerPartyBooking->handle(...))
                ->all(),
        );

        $recentBookings = array_values(
            $user->partyBookings()
                ->with('user:id,name,email')
                ->latest()
                ->limit(5)
                ->get()
                ->map($this->presentCustomerPartyBooking->handle(...))
                ->all(),
        );

        return [
            'openBookings' => $openBookings,
            'recentBookings' => $recentBookings,
        ];
    }
}
