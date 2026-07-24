<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('newsletter_subscriptions', function (Blueprint $table) {
            $table->string('email')->nullable()->after('id');
            $table->string('status')->default('pending')->index()->after('email');
            $table->string('confirmation_token_hash', 64)
                ->nullable()
                ->unique()
                ->after('consented_at');
            $table->timestamp('confirmation_sent_at')
                ->nullable()
                ->after('confirmation_token_hash');
            $table->timestamp('confirmed_at')
                ->nullable()
                ->after('confirmation_sent_at');
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
                        'status' => $subscription->unsubscribed_at === null
                            ? 'confirmed'
                            : 'unsubscribed',
                        'confirmed_at' => $subscription->consented_at,
                    ]);
            });

        Schema::table('newsletter_subscriptions', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropUnique(['user_id']);
            $table->dropColumn('user_id');
        });

        Schema::table('newsletter_subscriptions', function (Blueprint $table) {
            $table->string('email')->nullable(false)->change();
            $table->unique('email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('newsletter_subscriptions', function (Blueprint $table) {
            $table->foreignId('user_id')
                ->nullable()
                ->after('id')
                ->constrained()
                ->cascadeOnDelete();
        });

        DB::table('newsletter_subscriptions')
            ->orderBy('id')
            ->each(function (object $subscription): void {
                $userId = DB::table('users')
                    ->where('email', $subscription->email)
                    ->value('id');

                if ($userId === null) {
                    $userId = DB::table('users')->insertGetId([
                        'name' => '',
                        'email' => $subscription->email,
                        'password' => Hash::make(Str::random(64)),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }

                DB::table('newsletter_subscriptions')
                    ->where('id', $subscription->id)
                    ->update(['user_id' => $userId]);
            });

        Schema::table('newsletter_subscriptions', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable(false)->change();
            $table->unique('user_id');
            $table->dropUnique(['email']);
            $table->dropUnique(['confirmation_token_hash']);
            $table->dropIndex(['status']);
            $table->dropColumn([
                'email',
                'status',
                'confirmation_token_hash',
                'confirmation_sent_at',
                'confirmed_at',
            ]);
        });
    }
};
