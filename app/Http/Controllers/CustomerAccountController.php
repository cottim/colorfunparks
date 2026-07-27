<?php

namespace App\Http\Controllers;

use App\Actions\Customer\GetCustomerAccountOverview;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CustomerAccountController extends Controller
{
    public function __invoke(
        Request $request,
        GetCustomerAccountOverview $getCustomerAccountOverview,
    ): Response {
        $user = $request->user();

        if ($user === null) {
            abort(401);
        }

        return Inertia::render(
            'account/index',
            $getCustomerAccountOverview->handle($user),
        );
    }
}
