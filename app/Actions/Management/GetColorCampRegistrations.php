<?php

namespace App\Actions\Management;

use App\Models\ColorCampRegistration;

class GetColorCampRegistrations
{
    public function __construct(
        private readonly PresentColorCampRegistration $presentColorCampRegistration,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function handle(): array
    {
        return ColorCampRegistration::query()
            ->with('user:id,name,email')
            ->latest('id')
            ->paginate(20)
            ->withQueryString()
            ->through($this->presentColorCampRegistration->handle(...))
            ->toArray();
    }
}
