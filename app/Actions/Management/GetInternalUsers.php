<?php

namespace App\Actions\Management;

use App\Models\StaffInvitation;
use App\Models\User;
use App\UserRole;

/**
 * @phpstan-type InternalUserData array{
 *     id: int,
 *     name: string,
 *     email: string,
 *     role: array{value: string, label: string},
 *     created_at: string|null
 * }
 * @phpstan-type InvitationData array{
 *     id: int,
 *     email: string,
 *     role: array{value: string, label: string},
 *     expires_at: string,
 *     created_at: string|null
 * }
 */
class GetInternalUsers
{
    /**
     * @return array{
     *     users: array<string, mixed>,
     *     invitations: array<int, InvitationData>
     * }
     */
    public function handle(): array
    {
        $users = User::query()
            ->select(['id', 'name', 'email', 'role', 'created_at'])
            ->whereIn('role', [UserRole::Staff, UserRole::Admin])
            ->latest('id')
            ->paginate(20)
            ->withQueryString()
            ->through(
                fn (User $user): array => $this->transformUser($user),
            )
            ->toArray();

        $invitations = StaffInvitation::query()
            ->select(['id', 'email', 'role', 'expires_at', 'created_at'])
            ->whereNull('accepted_at')
            ->where('expires_at', '>', now())
            ->latest('id')
            ->get()
            ->map(
                fn (StaffInvitation $invitation): array => $this->transformInvitation(
                    $invitation,
                ),
            )
            ->all();

        return [
            'users' => $users,
            'invitations' => $invitations,
        ];
    }

    /**
     * @return InternalUserData
     */
    private function transformUser(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => [
                'value' => $user->role->value,
                'label' => $user->role->label(),
            ],
            'created_at' => $user->created_at?->toISOString(),
        ];
    }

    /**
     * @return InvitationData
     */
    private function transformInvitation(
        StaffInvitation $invitation,
    ): array {
        return [
            'id' => $invitation->id,
            'email' => $invitation->email,
            'role' => [
                'value' => $invitation->role->value,
                'label' => $invitation->role->label(),
            ],
            'expires_at' => $invitation->expires_at->format('c'),
            'created_at' => $invitation->created_at?->toISOString(),
        ];
    }
}
