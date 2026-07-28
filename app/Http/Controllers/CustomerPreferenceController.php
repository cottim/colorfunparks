<?php

namespace App\Http\Controllers;

use App\Actions\Customer\GetCustomerPreferences;
use App\Actions\Customer\RecordCustomerLegalConsent;
use App\Http\Requests\AcceptCustomerLegalConsentRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerPreferenceController extends Controller
{
    public function edit(
        Request $request,
        GetCustomerPreferences $getCustomerPreferences,
    ): Response {
        $user = $request->user();

        abort_unless($user instanceof User, 401);

        return Inertia::render('account/preferences', [
            'preferences' => $getCustomerPreferences->handle($user),
        ]);
    }

    public function acceptLegalConsent(
        AcceptCustomerLegalConsentRequest $request,
        RecordCustomerLegalConsent $recordCustomerLegalConsent,
    ): RedirectResponse {
        $user = $request->user();

        abort_unless($user instanceof User, 401);

        if (! $user->hasAcceptedCurrentLegalConsent()) {
            $recordCustomerLegalConsent->handle($user);
        }

        return to_route('account.preferences.edit');
    }
}
