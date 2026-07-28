<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $timestamp = now();

        DB::table('users')
            ->where('role', 'customer')
            ->whereNotExists(function ($query): void {
                $query
                    ->selectRaw('1')
                    ->from('play_card_memberships')
                    ->whereColumn(
                        'play_card_memberships.user_id',
                        'users.id',
                    );
            })
            ->orderBy('id')
            ->chunkById(500, function ($users) use ($timestamp): void {
                DB::table('play_card_memberships')->insert(
                    $users->map(fn ($user): array => [
                        'user_id' => $user->id,
                        'joined_at' => $timestamp,
                        'last_used_at' => null,
                        'deactivated_at' => null,
                        'created_at' => $timestamp,
                        'updated_at' => $timestamp,
                    ])->all(),
                );
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // This data backfill is intentionally irreversible.
    }
};
