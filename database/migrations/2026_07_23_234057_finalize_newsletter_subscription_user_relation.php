<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('newsletter_subscriptions', function (Blueprint $table) {
            $table->dropUnique('newsletter_subscriptions_email_unique');
            $table->dropColumn('email');
            $table->foreignId('user_id')->nullable(false)->change();
            $table->string('consent_version')->nullable(false)->change();
            $table->string('source')->nullable(false)->change();
            $table->unique('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('newsletter_subscriptions', function (Blueprint $table) {
            $table->dropUnique('newsletter_subscriptions_user_id_unique');
            $table->foreignId('user_id')->nullable()->change();
            $table->string('email')->nullable();
        });

        DB::table('newsletter_subscriptions')
            ->orderBy('id')
            ->each(function (object $subscription): void {
                DB::table('newsletter_subscriptions')
                    ->where('id', $subscription->id)
                    ->update([
                        'email' => DB::table('users')
                            ->where('id', $subscription->user_id)
                            ->value('email'),
                    ]);
            });

        Schema::table('newsletter_subscriptions', function (Blueprint $table) {
            $table->string('email')->nullable(false)->change();
            $table->unique('email');
        });
    }
};
