<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('color_camp_registrations', function (Blueprint $table) {
            $table->timestamp('health_data_consented_at')->nullable();
            $table->string('health_data_consent_version')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('color_camp_registrations', function (Blueprint $table) {
            $table->dropColumn([
                'health_data_consented_at',
                'health_data_consent_version',
            ]);
        });
    }
};
