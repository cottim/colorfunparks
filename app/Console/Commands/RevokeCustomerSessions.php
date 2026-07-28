<?php

namespace App\Console\Commands;

use App\Models\User;
use App\UserRole;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

#[Signature('security:revoke-customer-sessions {--force : Run in production}')]
#[Description('Revoke every active and remembered customer session')]
class RevokeCustomerSessions extends Command
{
    public function handle(): int
    {
        if (app()->isProduction() && ! $this->option('force')) {
            $this->error('Use --force to revoke customer sessions in production.');

            return self::FAILURE;
        }

        if (config('session.driver') !== 'database') {
            $this->error('This command requires the database session driver.');

            return self::FAILURE;
        }

        $customerCount = User::query()
            ->where('role', UserRole::Customer)
            ->count();

        $revokedSessionCount = DB::table(
            (string) config('session.table', 'sessions'),
        )
            ->whereIn(
                'user_id',
                User::query()
                    ->select('id')
                    ->where('role', UserRole::Customer),
            )
            ->delete();

        User::query()
            ->where('role', UserRole::Customer)
            ->update(['remember_token' => null]);

        $this->info(
            "Revoked {$revokedSessionCount} sessions for {$customerCount} customers.",
        );

        return self::SUCCESS;
    }
}
