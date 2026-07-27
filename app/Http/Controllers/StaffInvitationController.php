<?php

namespace App\Http\Controllers;

use App\Actions\Management\AcceptInternalInvitation;
use App\Http\Requests\AcceptStaffInvitationRequest;
use App\Models\StaffInvitation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class StaffInvitationController extends Controller
{
    public function show(string $token): Response
    {
        $invitation = $this->resolveInvitation($token);

        return Inertia::render('auth/accept-staff-invitation', [
            'email' => $invitation->email,
            'role' => $invitation->role->label(),
            'token' => $token,
        ]);
    }

    public function store(
        AcceptStaffInvitationRequest $request,
        string $token,
        AcceptInternalInvitation $acceptInternalInvitation,
    ): RedirectResponse {
        $invitation = $this->resolveInvitation($token);
        $user = $acceptInternalInvitation->handle(
            $invitation,
            $request->string('name')->toString(),
            $request->string('password')->toString(),
        );

        Auth::login($user, remember: true);
        $request->session()->regenerate();

        return to_route('management.index');
    }

    private function resolveInvitation(string $token): StaffInvitation
    {
        $invitation = StaffInvitation::query()
            ->where('token_hash', hash('sha256', $token))
            ->firstOrFail();

        abort_unless($invitation->isAcceptable(), 410);

        return $invitation;
    }
}
