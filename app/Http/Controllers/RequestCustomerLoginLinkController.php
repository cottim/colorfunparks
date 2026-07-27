<?php

namespace App\Http\Controllers;

use App\Actions\Customer\SendCustomerLoginLink;
use App\Http\Requests\RequestCustomerLoginLinkRequest;
use Illuminate\Http\RedirectResponse;

class RequestCustomerLoginLinkController extends Controller
{
    public function __invoke(
        RequestCustomerLoginLinkRequest $request,
        SendCustomerLoginLink $sendCustomerLoginLink,
    ): RedirectResponse {
        $sendCustomerLoginLink->handle(
            $request->validated('email'),
        );

        return back()->with(
            'status',
            'Se o endereço estiver disponível para acesso, receberás um email com o teu link.',
        );
    }
}
