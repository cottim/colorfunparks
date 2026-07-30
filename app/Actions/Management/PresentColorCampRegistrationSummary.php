<?php

namespace App\Actions\Management;

use App\Actions\ColorCamp\PresentColorCampRegistrationSummary as PresentRegistrationSummary;
use App\Models\ColorCampRegistration;
use App\Models\User;

class PresentColorCampRegistrationSummary
{
    public function __construct(
        private readonly PresentRegistrationSummary $presentRegistrationSummary,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function handle(ColorCampRegistration $registration): array
    {
        $customer = $registration->getRelation('user');
        $customerName = $customer instanceof User ? $customer->name : null;
        $customerEmail = $customer instanceof User ? $customer->email : null;

        return [
            ...$this->presentRegistrationSummary->handle($registration),
            'status' => [
                'value' => $registration->status->value,
                'label' => $registration->status->label(),
            ],
            'customer' => [
                'name' => $registration->contact_name
                    ?? $customerName
                    ?? 'Sem nome',
                'email' => $registration->contact_email
                    ?? $customerEmail
                    ?? 'Sem email',
            ],
        ];
    }
}
