<?php

namespace App\Actions\Customer;

use App\Models\User;
use Carbon\CarbonInterface;

class RecordCustomerLegalConsent
{
    public function handle(
        User $user,
        ?CarbonInterface $privacyAcceptedAt = null,
        ?CarbonInterface $termsAcceptedAt = null,
        ?string $version = null,
    ): void {
        $user->forceFill([
            'privacy_accepted_at' => $privacyAcceptedAt ?? now(),
            'terms_accepted_at' => $termsAcceptedAt ?? now(),
            'legal_consent_version' => $version
                ?? User::LEGAL_CONSENT_VERSION,
        ])->save();
    }
}
