<?php

namespace App\Actions\Settings;

use App\Mail\ConfirmEmailChangeMail;
use App\Models\PendingEmailChange;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class RequestEmailChange
{
    public function handle(User $user, string $email): PendingEmailChange
    {
        $plainTextToken = Str::random(64);
        $shouldSendConfirmation = false;

        $pendingEmailChange = DB::transaction(
            function () use (
                $user,
                $email,
                $plainTextToken,
                &$shouldSendConfirmation,
            ): PendingEmailChange {
                $lockedUser = User::query()
                    ->whereKey($user->getKey())
                    ->lockForUpdate()
                    ->firstOrFail();

                PendingEmailChange::query()
                    ->where('email', $email)
                    ->where('expires_at', '<=', now())
                    ->delete();

                $existingChange = $lockedUser
                    ->pendingEmailChange()
                    ->lockForUpdate()
                    ->first();
                $resendAvailableAt = $existingChange?->created_at?->addMinutes(
                    (int) config('email_changes.resend_cooldown_minutes'),
                );

                if (
                    $existingChange?->email === $email
                    && $resendAvailableAt?->isFuture()
                ) {
                    return $existingChange;
                }

                $existingChange?->delete();
                $shouldSendConfirmation = true;

                return $lockedUser->pendingEmailChange()->create([
                    'email' => $email,
                    'token_hash' => hash('sha256', $plainTextToken),
                    'expires_at' => now()->addMinutes(
                        (int) config('email_changes.expiration_minutes'),
                    ),
                ]);
            },
            attempts: 3,
        );

        if ($shouldSendConfirmation) {
            Mail::to($pendingEmailChange->email)->send(
                new ConfirmEmailChangeMail(
                    $pendingEmailChange,
                    $plainTextToken,
                ),
            );
        }

        return $pendingEmailChange;
    }
}
