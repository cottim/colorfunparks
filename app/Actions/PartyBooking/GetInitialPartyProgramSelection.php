<?php

namespace App\Actions\PartyBooking;

class GetInitialPartyProgramSelection
{
    /**
     * @param  array<string, mixed>  $choices
     * @return array{
     *     programValue: string,
     *     choices: array<string, string>
     * }|null
     */
    public function handle(
        ?string $programValue,
        array $choices,
    ): ?array {
        /** @var list<array{
         *     value: string,
         *     choiceGroups: list<array{
         *         value: string,
         *         options: list<array{value: string}>
         *     }>
         * }> $programs
         */
        $programs = config('party_bookings.programs');

        $program = collect($programs)->firstWhere('value', $programValue);

        if ($program === null) {
            return null;
        }

        $validChoices = [];

        foreach ($program['choiceGroups'] as $choiceGroup) {
            $choice = $choices[$choiceGroup['value']] ?? null;

            if (! is_string($choice)) {
                continue;
            }

            if (
                collect($choiceGroup['options'])
                    ->contains('value', $choice)
            ) {
                $validChoices[$choiceGroup['value']] = $choice;
            }
        }

        return [
            'programValue' => $program['value'],
            'choices' => $validChoices,
        ];
    }
}
