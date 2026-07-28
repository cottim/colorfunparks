<?php

namespace App\Actions\Customer;

use App\Models\User;
use App\NewsletterSubscriptionStatus;
use App\PlayCardStatus;

class GetCustomerPreferences
{
    /**
     * @return array{
     *     marketing: array{
     *         status: 'not-authorized'|'pending'|'authorized',
     *         label: string,
     *         isAuthorized: bool
     *     },
     *     legal: array{
     *         status: 'accepted'|'required',
     *         label: string,
     *         privacyAcceptedAt: string|null,
     *         termsAcceptedAt: string|null
     *     },
     *     playCard: array{
     *         status: string,
     *         label: string,
     *         joinedAt: string|null,
     *         lastUsedAt: string|null,
     *         benefitsActiveUntil: string|null,
     *         benefitsBasedOn: 'account-creation'|'last-use'|null
     *     }
     * }
     */
    public function handle(User $user): array
    {
        $user->loadMissing([
            'newsletterSubscription',
            'playCardMembership',
        ]);

        $subscription = $user->newsletterSubscription;
        $marketingStatus = match (true) {
            $subscription?->status === NewsletterSubscriptionStatus::Confirmed
                && $subscription->unsubscribed_at === null => 'authorized',
            $subscription?->status === NewsletterSubscriptionStatus::Pending => 'pending',
            default => 'not-authorized',
        };

        $playCardMembership = $user->playCardMembership;
        $hasAcceptedLegalConsent = $user
            ->hasAcceptedCurrentLegalConsent();
        $playCardStatus = $playCardMembership?->status()
            ?? PlayCardStatus::Inactive;
        $benefitsBasedOn = match (true) {
            $playCardMembership === null => null,
            $playCardMembership->last_used_at?->greaterThan(
                $playCardMembership->joined_at,
            ) => 'last-use',
            default => 'account-creation',
        };

        return [
            'marketing' => [
                'status' => $marketingStatus,
                'label' => match ($marketingStatus) {
                    'authorized' => 'Autorizado',
                    'pending' => 'Confirmação pendente',
                    default => 'Não autorizado',
                },
                'isAuthorized' => $marketingStatus === 'authorized',
            ],
            'legal' => [
                'status' => $hasAcceptedLegalConsent
                    ? 'accepted'
                    : 'required',
                'label' => $hasAcceptedLegalConsent
                    ? 'Aceite'
                    : 'Ação necessária',
                'privacyAcceptedAt' => $user->privacy_accepted_at
                    ?->toDateString(),
                'termsAcceptedAt' => $user->terms_accepted_at
                    ?->toDateString(),
            ],
            'playCard' => [
                'status' => $playCardStatus->value,
                'label' => $playCardStatus->label(),
                'joinedAt' => $playCardMembership?->joined_at?->toDateString(),
                'lastUsedAt' => $playCardMembership?->last_used_at?->toDateString(),
                'benefitsActiveUntil' => $playCardMembership
                    ?->benefitsActiveUntil()
                    ->toDateString(),
                'benefitsBasedOn' => $benefitsBasedOn,
            ],
        ];
    }
}
