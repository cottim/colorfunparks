<?php

use App\Models\ColorCampRegistration;
use App\Models\PartyBooking;
use Illuminate\Support\Carbon;

test('party bookings older than the retention period are pruned', function () {
    config(['privacy.retention_days.party_bookings' => 730]);

    $expired = PartyBooking::factory()->create([
        'party_date' => today()->subDays(731),
    ]);
    $retained = PartyBooking::factory()->create([
        'party_date' => today()->subDays(729),
    ]);

    $this->artisan('model:prune', [
        '--model' => [PartyBooking::class],
    ])->assertSuccessful();

    $this->assertModelMissing($expired);
    $this->assertModelExists($retained);
});

test('Color Camp registrations older than the retention period are pruned', function () {
    config(['privacy.retention_days.color_camp_registrations' => 730]);
    Carbon::setTestNow('2026-07-30 12:00:00');

    $expired = ColorCampRegistration::factory()->create([
        'created_at' => now()->subDays(731),
    ]);
    $retained = ColorCampRegistration::factory()->create([
        'created_at' => now()->subDays(729),
    ]);

    $this->artisan('model:prune', [
        '--model' => [ColorCampRegistration::class],
    ])->assertSuccessful();

    $this->assertModelMissing($expired);
    $this->assertModelExists($retained);
});
