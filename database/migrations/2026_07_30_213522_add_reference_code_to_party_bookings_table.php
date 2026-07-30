<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('party_bookings', function (Blueprint $table) {
            $table->string('reference_code')->nullable()->unique();
        });
    }

    public function down(): void
    {
        Schema::table('party_bookings', function (Blueprint $table) {
            $table->dropUnique(['reference_code']);
            $table->dropColumn('reference_code');
        });
    }
};
