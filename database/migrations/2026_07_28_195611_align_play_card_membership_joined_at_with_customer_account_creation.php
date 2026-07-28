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
        DB::table('users')
            ->select(['id', 'created_at'])
            ->where('role', 'customer')
            ->whereExists(function ($query): void {
                $query
                    ->selectRaw('1')
                    ->from('play_card_memberships')
                    ->whereColumn(
                        'play_card_memberships.user_id',
                        'users.id',
                    );
            })
            ->orderBy('id')
            ->chunkById(500, function ($users): void {
                foreach ($users as $user) {
                    DB::table('play_card_memberships')
                        ->where('user_id', $user->id)
                        ->update([
                            'joined_at' => $user->created_at,
                        ]);
                }
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // This data alignment is intentionally irreversible.
    }
};
