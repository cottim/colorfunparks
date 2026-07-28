<?php

namespace App\Actions\Customer;

use App\Mail\CustomerLoginLinkMail;
use Illuminate\Support\Facades\Mail;

class SendCustomerLoginLink
{
    public function __construct(
        private IssueCustomerLoginLink $issueCustomerLoginLink,
    ) {}

    public function handle(string $email): void
    {
        $loginUrl = $this->issueCustomerLoginLink->handle(
            $email,
            recordsLegalConsent: true,
        );

        if ($loginUrl === null) {
            return;
        }

        Mail::to($email)->send(new CustomerLoginLinkMail($loginUrl));
    }
}
