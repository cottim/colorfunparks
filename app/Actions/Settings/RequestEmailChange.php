<?php

namespace App\Actions\Settings;

use App\Mail\ConfirmEmailChangeMail;
use App\Models\PendingEmailChange;
use App\Models\User;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class RequestEmailChange
{
    public function handle(User $user, string $email): PendingEmailChange
    {
        $plainTextToken = Str::random(64);

        try {
            $pendingEmailChange = DB::transaction(
                function () use ($user, $email, $plainTextToken): PendingEmailChange {
                    $lockedUser = User::query()
                        ->whereKey($user->getKey())
                        ->lockForUpdate()
                        ->firstOrFail();

                    PendingEmailChange::query()
                        ->where('email', $email)
                        ->where('expires_at', '<=', now())
                        ->delete();

                    $emailIsUnavailable = User::query()
                        ->where('email', $email)
                        ->whereKeyNot($lockedUser->getKey())
                        ->exists()
                        || PendingEmailChange::query()
                            ->where('email', $email)
                            ->where('user_id', '!=', $lockedUser->getKey())
                            ->exists();

                    if ($emailIsUnavailable) {
                        throw ValidationException::withMessages([
                            'email' => 'Este endereço de email não está disponível.',
                        ]);
                    }

                    $lockedUser->pendingEmailChange()->delete();

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
        } catch (UniqueConstraintViolationException) {
            throw ValidationException::withMessages([
                'email' => 'Este endereço de email não está disponível.',
            ]);
        }

        Mail::to($pendingEmailChange->email)->send(
            new ConfirmEmailChangeMail(
                $pendingEmailChange,
                $plainTextToken,
            ),
        );

        return $pendingEmailChange;
    }
}
