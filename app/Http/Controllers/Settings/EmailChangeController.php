<?php

namespace App\Http\Controllers\Settings;

use App\Actions\Settings\ConfirmEmailChange;
use App\Actions\Settings\RequestEmailChange;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\RequestEmailChangeRequest;
use App\Models\PendingEmailChange;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailChangeController extends Controller
{
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/email', [
            'pendingEmailChange' => $request->user()
                ?->pendingEmailChange()
                ->first(['email', 'expires_at']),
        ]);
    }

    public function store(
        RequestEmailChangeRequest $request,
        RequestEmailChange $requestEmailChange,
    ): RedirectResponse {
        $user = $request->user();

        abort_unless($user !== null, 401);

        $requestEmailChange->handle(
            $user,
            $request->validated('email'),
        );

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Enviámos uma confirmação para o novo email.',
        ]);

        return to_route('profile.edit');
    }

    public function confirm(
        Request $request,
        PendingEmailChange $pendingEmailChange,
        string $token,
        ConfirmEmailChange $confirmEmailChange,
    ): RedirectResponse {
        $authenticatedUser = $request->user();
        $preserveCurrentSession = $authenticatedUser?->is(
            $pendingEmailChange->user,
        ) ?? false;

        $confirmEmailChange->handle(
            $pendingEmailChange,
            $token,
            $preserveCurrentSession
                ? $request->session()->getId()
                : null,
        );

        if ($preserveCurrentSession) {
            Inertia::flash('toast', [
                'type' => 'success',
                'message' => 'O teu email foi alterado e confirmado.',
            ]);

            return to_route('profile.edit');
        }

        return to_route('login')->with(
            'status',
            'O novo email foi confirmado. Já podes utilizá-lo para entrar.',
        );
    }

    public function destroy(Request $request): RedirectResponse
    {
        $request->user()?->pendingEmailChange()->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'A alteração de email foi cancelada.',
        ]);

        return to_route('profile.edit');
    }
}
