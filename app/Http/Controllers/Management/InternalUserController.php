<?php

namespace App\Http\Controllers\Management;

use App\Actions\Management\GetInternalUsers;
use App\Actions\Management\InviteInternalUser;
use App\Http\Controllers\Controller;
use App\Http\Requests\InviteStaffUserRequest;
use App\Models\User;
use App\UserRole;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class InternalUserController extends Controller
{
    public function index(GetInternalUsers $getInternalUsers): Response
    {
        Gate::authorize('manage-internal-users');

        return Inertia::render(
            'management/users/index',
            $getInternalUsers->handle(),
        );
    }

    public function store(
        InviteStaffUserRequest $request,
        InviteInternalUser $inviteInternalUser,
    ): RedirectResponse {
        $invitedBy = $request->user();
        abort_unless($invitedBy instanceof User, 401);

        $inviteInternalUser->handle(
            $invitedBy,
            $request->string('email')->toString(),
            UserRole::from($request->string('role')->toString()),
        );

        return back()->with(
            'success',
            'O convite foi enviado.',
        );
    }
}
