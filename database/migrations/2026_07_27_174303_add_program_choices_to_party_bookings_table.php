<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('party_bookings', function (Blueprint $table) {
            $table->json('program_choices')->nullable()->after('program');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('party_bookings', function (Blueprint $table) {
            $table->dropColumn('program_choices');
        });
    }
};
