<?php

namespace Database\Seeders;

use App\Models\PartyBooking;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PartyBookingSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PartyBooking::factory()->count(10)->create();
    }
}
