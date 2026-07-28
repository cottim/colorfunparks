<?php

use App\ColorCampRegistrationStatus;
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
        Schema::create('color_camp_registrations', function (Blueprint $table) {
            $table->id();
            $table
                ->foreignId('user_id')
                ->nullable()
                ->constrained()
                ->cascadeOnDelete();
            $table
                ->string('status')
                ->default(ColorCampRegistrationStatus::Pending->value)
                ->index();
            $table->string('contact_name')->nullable();
            $table->string('contact_email')->nullable()->index();
            $table->string('contact_phone', 30);
            $table->string('child_name');
            $table->date('child_birth_date');
            $table->text('allergies_and_health_notes')->nullable();
            $table->string('authorized_pickup_name');
            $table->string('authorized_pickup_phone', 30);
            $table->string('attendance_type');
            $table->json('selected_weeks')->nullable();
            $table->json('selected_days')->nullable();
            $table->string('lunch_option');
            $table->string('discount')->nullable();
            $table->boolean('needs_extended_care')->default(false);
            $table->boolean('trip_authorized');
            $table->string('photo_consent');
            $table->text('notes')->nullable();
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
        Schema::dropIfExists('color_camp_registrations');
    }
};
