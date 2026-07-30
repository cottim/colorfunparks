<?php

namespace App\Actions\Management;

use App\Models\ColorCampRegistration;

class GetColorCampRegistrations
{
    public function __construct(
        private readonly PresentColorCampRegistrationSummary $presentColorCampRegistration,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function handle(): array
    {
        return ColorCampRegistration::query()
            ->select([
                'id',
                'reference_code',
                'user_id',
                'status',
                'contact_name',
                'contact_email',
                'child_name',
                'attendance_type',
                'selected_weeks',
                'selected_days',
                'created_at',
            ])
            ->with('user:id,name,email')
            ->latest('id')
            ->paginate(20)
            ->withQueryString()
            ->through($this->presentColorCampRegistration->handle(...))
            ->toArray();
    }
}
