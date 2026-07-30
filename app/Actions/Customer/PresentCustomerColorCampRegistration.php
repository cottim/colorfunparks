<?php

namespace App\Actions\Customer;

use App\Actions\ColorCamp\PresentColorCampRegistrationSummary;
use App\Models\ColorCampRegistration;

class PresentCustomerColorCampRegistration
{
    public function __construct(
        private readonly PresentColorCampRegistrationSummary $presentSummary,
    ) {}

    /**
     * @return array{
     *     id: int,
     *     reference: string,
     *     status: string,
     *     statusLabel: string,
     *     childName: string,
     *     childBirthDate: string,
     *     attendanceType: string,
     *     attendanceLabel: string,
     *     selectedPeriods: list<string>,
     *     lunchOption: string,
     *     discount: string|null,
     *     needsExtendedCare: bool,
     *     tripAuthorized: bool,
     *     photoConsent: string,
     *     allergiesAndHealthNotes: string|null,
     *     authorizedPickupName: string,
     *     authorizedPickupPhone: string,
     *     contactPhone: string,
     *     notes: string|null,
     *     createdAt: string
     * }
     */
    public function handle(ColorCampRegistration $registration): array
    {
        return [
            ...$this->presentSummary->handle($registration),
            'childBirthDate' => $registration
                ->child_birth_date
                ->toDateString(),
            'lunchOption' => $this->optionLabel(
                'lunch_options',
                $registration->lunch_option,
            ),
            'discount' => $registration->discount !== null
                ? $this->optionLabel(
                    'discounts',
                    $registration->discount,
                )
                : null,
            'needsExtendedCare' => $registration->needs_extended_care,
            'tripAuthorized' => $registration->trip_authorized,
            'photoConsent' => $this->optionLabel(
                'photo_consents',
                $registration->photo_consent,
            ),
            'allergiesAndHealthNotes' => $registration
                ->allergies_and_health_notes,
            'authorizedPickupName' => $registration
                ->authorized_pickup_name,
            'authorizedPickupPhone' => $registration
                ->authorized_pickup_phone,
            'contactPhone' => $registration->contact_phone,
            'notes' => $registration->notes,
        ];
    }

    private function optionLabel(string $optionGroup, string $value): string
    {
        /** @var list<array{value: string, label: string}> $options */
        $options = config('color_camp.'.$optionGroup);
        $option = collect($options)->firstWhere('value', $value);

        return is_array($option) ? $option['label'] : $value;
    }
}
