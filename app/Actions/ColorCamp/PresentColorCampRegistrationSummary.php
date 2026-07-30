<?php

namespace App\Actions\ColorCamp;

use App\Models\ColorCampRegistration;

class PresentColorCampRegistrationSummary
{
    /**
     * @return array{
     *     id: int,
     *     reference: string,
     *     status: string,
     *     statusLabel: string,
     *     childName: string,
     *     attendanceType: string,
     *     attendanceLabel: string,
     *     selectedPeriods: list<string>,
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
            'attendanceType' => $registration->attendance_type,
            'attendanceLabel' => $registration->attendance_type === 'weeks'
                ? 'Semanas completas'
                : 'Dias avulso',
            'selectedPeriods' => $this->selectedPeriodLabels(
                $registration,
            ),
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
