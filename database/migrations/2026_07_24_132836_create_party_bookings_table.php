<?php

use App\PartyBookingStatus;
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
        Schema::create('party_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table
                ->string('status')
                ->default(PartyBookingStatus::Pending->value)
                ->index();
            $table->string('park');
            $table->string('child_name');
            $table->unsignedTinyInteger('child_age');
            $table->date('party_date')->index();
            $table->string('party_time', 5);
            $table->unsignedSmallInteger('guests');
            $table->string('program');
            $table->string('contact_phone')->nullable();
            $table->timestamp('privacy_accepted_at');
            $table->timestamp('terms_accepted_at');
            $table->timestamps();

            $table->index(['status', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('party_bookings');
    }
};
