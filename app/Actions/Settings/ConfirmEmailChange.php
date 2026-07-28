<?php

namespace App\Actions\Settings;

use App\Actions\Auth\RevokeUserSessions;
use App\Models\PendingEmailChange;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

class ConfirmEmailChange
{
    public function __construct(
        private readonly RevokeUserSessions $revokeUserSessions,
    ) {}

    public function handle(
        PendingEmailChange $pendingEmailChange,
        string $plainTextToken,
        ?string $currentSessionId = null,
    ): User {
        return DB::transaction(function () use (
            $pendingEmailChange,
            $plainTextToken,
            $currentSessionId,
        ): User {
            $lockedChange = PendingEmailChange::query()
                ->whereKey($pendingEmailChange->getKey())
                ->lockForUpdate()
                ->firstOrFail();

            abort_unless(
                $lockedChange->expires_at->isFuture()
                && hash_equals(
                    $lockedChange->token_hash,
                    hash('sha256', $plainTextToken),
                ),
                403,
            );

            $user = User::query()
                ->whereKey($lockedChange->user_id)
                ->lockForUpdate()
                ->firstOrFail();

            if (
                User::query()
                    ->where('email', $lockedChange->email)
                    ->whereKeyNot($user->getKey())
                    ->exists()
            ) {
                throw new ConflictHttpException(
                    'Este endereço de email já está a ser utilizado.',
                );
            }

            $user->forceFill([
                'email' => $lockedChange->email,
                'email_verified_at' => now(),
            ])->save();

            $lockedChange->delete();
            $this->revokeUserSessions->handle($user, $currentSessionId);

            return $user;
        }, attempts: 3);
    }
}
