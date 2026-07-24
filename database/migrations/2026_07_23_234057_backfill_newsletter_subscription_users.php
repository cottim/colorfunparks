<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('newsletter_subscriptions')
            ->orderBy('id')
            ->each(function (object $subscription): void {
                $email = Str::lower($subscription->email);
                $userId = DB::table('users')
                    ->where('email', $email)
                    ->value('id');

                if ($userId === null) {
                    $userId = DB::table('users')->insertGetId([
                        'name' => '',
                        'email' => $email,
                        'password' => Hash::make(Str::random(64)),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }

                DB::table('newsletter_subscriptions')
                    ->where('id', $subscription->id)
                    ->update([
                        'user_id' => $userId,
                        'consent_version' => 'v1',
                        'source' => 'homepage',
                        'updated_at' => now(),
                    ]);
            });
    }

    /**
     * The generated users are intentionally preserved when rolling back.
     */
    public function down(): void
    {
        //
    }
};
