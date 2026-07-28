<?php

use App\Models\User;
use Illuminate\Support\Facades\DB;

test('it revokes customer sessions without affecting internal users', function () {
    config([
        'session.driver' => 'database',
        'session.table' => 'sessions',
    ]);

    $customer = User::factory()->create([
        'remember_token' => 'customer-token',
    ]);
    $staff = User::factory()->staff()->create([
        'remember_token' => 'staff-token',
    ]);

    foreach ([
        'customer-session' => $customer->id,
        'staff-session' => $staff->id,
    ] as $sessionId => $userId) {
        DB::table('sessions')->insert([
            'id' => $sessionId,
            'user_id' => $userId,
            'ip_address' => null,
            'user_agent' => null,
            'payload' => '',
            'last_activity' => time(),
        ]);
    }

    $this->artisan('security:revoke-customer-sessions')
        ->expectsOutput(
            'Revoked 1 sessions for 1 customers.',
        )
        ->assertSuccessful();

    expect(
        DB::table('sessions')
            ->where('user_id', $customer->id)
            ->exists(),
    )->toBeFalse()
        ->and(
            DB::table('sessions')
                ->where('user_id', $staff->id)
                ->exists(),
        )->toBeTrue()
        ->and($customer->refresh()->remember_token)->toBeNull()
        ->and($staff->refresh()->remember_token)->toBe('staff-token');
});
