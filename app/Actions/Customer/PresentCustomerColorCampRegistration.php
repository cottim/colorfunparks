<?php

namespace App\Actions\Customer;

use App\Models\ColorCampRegistration;

class PresentCustomerColorCampRegistration
{
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
            'id' => $registration->id,
            'reference' => $registration->reference(),
            'status' => $registration->status->value,
            'statusLabel' => $registration->status->label(),
            'childName' => $registration->child_name,
            'childBirthDate' => $registration
                ->child_birth_date
                ->toDateString(),
            'attendanceType' => $registration->attendance_type,
            'attendanceLabel' => $registration->attendance_type === 'weeks'
                ? 'Semanas completas'
                : 'Dias avulso',
            'selectedPeriods' => $this->selectedPeriodLabels(
                $registration,
            ),
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
            'createdAt' => $registration->created_at->toIso8601String(),
        ];
    }

    /**
     * @return list<string>
     */
    private function selectedPeriodLabels(
        ColorCampRegistration $registration,
    ): array {
        $optionGroup = $registration->attendance_type === 'weeks'
            ? 'weeks'
            : 'days';
        $selectedValues = $registration->attendance_type === 'weeks'
            ? ($registration->selected_weeks ?? [])
            : ($registration->selected_days ?? []);

        return array_map(
            fn (string $value): string => $this->optionLabel(
                $optionGroup,
                $value,
            ),
            $selectedValues,
        );
    }

    private function optionLabel(string $optionGroup, string $value): string
    {
        /** @var list<array{value: string, label: string}> $options */
        $options = config('color_camp.'.$optionGroup);
        $option = collect($options)->firstWhere('value', $value);

        return is_array($option) ? $option['label'] : $value;
    }
}
