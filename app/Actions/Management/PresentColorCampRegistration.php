<?php

namespace App\Actions\Management;

use App\Actions\Customer\PresentCustomerColorCampRegistration;
use App\ColorCampRegistrationStatus;
use App\Models\ColorCampRegistration;
use App\Models\User;

class PresentColorCampRegistration
{
    public function __construct(
        private readonly PresentCustomerColorCampRegistration $presentCustomerRegistration,
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
            ...$this->presentCustomerRegistration->handle($registration),
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
                'phone' => $registration->contact_phone,
            ],
            'statusOptions' => array_map(
                fn (ColorCampRegistrationStatus $status): array => [
                    'value' => $status->value,
                    'label' => $status->label(),
                ],
                ColorCampRegistrationStatus::cases(),
            ),
        ];
    }
}
