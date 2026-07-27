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
            $table->foreignId('user_id')->nullable()->change();
            $table->string('contact_name')->nullable()->after('program');
            $table
                ->string('contact_email')
                ->nullable()
                ->after('contact_name')
                ->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('party_bookings', function (Blueprint $table) {
            $table->dropIndex(['contact_email']);
            $table->dropColumn(['contact_name', 'contact_email']);
            $table->foreignId('user_id')->nullable(false)->change();
        });
    }
};
