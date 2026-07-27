<?php

namespace App\Actions\Management;

use App\Models\User;
use App\NewsletterSubscriptionStatus;
use App\UserRole;

/**
 * @phpstan-type ManagedCustomer array{
 *     id: int,
 *     name: string,
 *     email: string,
 *     marketing: array{value: string, label: string},
 *     party_bookings_count: int,
 *     created_at: string|null
 * }
 */
class GetCustomers
{
    /**
     * @return array<string, mixed>
     */
    public function handle(): array
    {
        return User::query()
            ->select(['id', 'name', 'email', 'created_at'])
            ->where('role', UserRole::Customer)
            ->with('newsletterSubscription:id,email,status')
            ->withCount('partyBookings')
            ->latest('id')
            ->paginate(20)
            ->withQueryString()
            ->through(
                fn (User $user): array => $this->transformCustomer($user),
            )
            ->toArray();
    }

    /**
     * @return ManagedCustomer
     */
    private function transformCustomer(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'marketing' => $this->marketingStatus($user),
            'party_bookings_count' => $user->party_bookings_count,
            'created_at' => $user->created_at?->toISOString(),
        ];
    }

    /**
     * @return array{value: string, label: string}
     */
    private function marketingStatus(User $user): array
    {
        $status = $user->newsletterSubscription?->status;

        return match ($status) {
            NewsletterSubscriptionStatus::Confirmed => [
                'value' => 'accepted',
                'label' => 'Aceite',
            ],
            NewsletterSubscriptionStatus::Pending => [
                'value' => 'pending',
                'label' => 'Por confirmar',
            ],
            NewsletterSubscriptionStatus::Unsubscribed => [
                'value' => 'unsubscribed',
                'label' => 'Cancelado',
            ],
            default => [
                'value' => 'not_accepted',
                'label' => 'Não aceite',
            ],
        };
    }
}
