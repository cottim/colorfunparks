<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateCustomerProfileRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CustomerProfileController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('account/profile');
    }

    public function update(
        UpdateCustomerProfileRequest $request,
    ): RedirectResponse {
        $user = $request->user();

        abort_unless($user instanceof User, 401);

        $user->update($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Nome atualizado.',
        ]);

        return to_route('account.profile.edit');
    }
}
