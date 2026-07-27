<?php

namespace App\Actions\Management;

use App\Models\StaffInvitation;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AcceptInternalInvitation
{
    public function handle(
        StaffInvitation $invitation,
        string $name,
        string $password,
    ): User {
        return DB::transaction(function () use (
            $invitation,
            $name,
            $password,
        ): User {
            $lockedInvitation = StaffInvitation::query()
                ->lockForUpdate()
                ->findOrFail($invitation->id);

            if (! $lockedInvitation->isAcceptable()) {
                throw ValidationException::withMessages([
                    'invitation' => 'Este convite já não é válido.',
                ]);
            }

            if (User::query()->where('email', $lockedInvitation->email)->exists()) {
                throw ValidationException::withMessages([
                    'invitation' => 'Já existe uma conta com este email.',
                ]);
            }

            $user = new User;
            $user->forceFill([
                'name' => $name,
                'email' => $lockedInvitation->email,
                'email_verified_at' => now(),
                'password' => $password,
                'role' => $lockedInvitation->role,
            ]);
            $user->save();

            $lockedInvitation->update([
                'accepted_at' => now(),
            ]);

            return $user;
        });
    }
}
