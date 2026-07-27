<?php

namespace App\Actions\Management;

use App\Mail\StaffInvitationMail;
use App\Models\StaffInvitation;
use App\Models\User;
use App\UserRole;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class InviteInternalUser
{
    public function handle(
        ?User $invitedBy,
        string $email,
        UserRole $role,
    ): StaffInvitation {
        $token = Str::random(64);

        $invitation = DB::transaction(function () use (
            $invitedBy,
            $email,
            $role,
            $token,
        ): StaffInvitation {
            StaffInvitation::query()
                ->where('email', $email)
                ->whereNull('accepted_at')
                ->lockForUpdate()
                ->delete();

            return StaffInvitation::query()->create([
                'invited_by_id' => $invitedBy?->id,
                'email' => $email,
                'role' => $role,
                'token_hash' => hash('sha256', $token),
                'expires_at' => now()->addHours(
                    (int) config(
                        'staff_invitations.expires_after_hours',
                    ),
                ),
            ]);
        });

        Mail::to($invitation->email)->send(
            new StaffInvitationMail($invitation, $token),
        );

        return $invitation;
    }
}
