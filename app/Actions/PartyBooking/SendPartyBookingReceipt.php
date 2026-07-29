<?php

namespace App\Actions\PartyBooking;

use App\Actions\Customer\IssueCustomerLoginLink;
use App\Mail\PartyBookingReceivedMail;
use App\Models\PartyBooking;
use Illuminate\Support\Facades\Mail;

class SendPartyBookingReceipt
{
    public function __construct(
        private readonly IssueCustomerLoginLink $issueCustomerLoginLink,
    ) {}

    public function handle(PartyBooking $partyBooking): void
    {
        if ($partyBooking->contact_email === null) {
            return;
        }

        $loginUrl = $this->issueCustomerLoginLink->handle(
            $partyBooking->contact_email,
            recordsLegalConsent: true,
        );

        Mail::to($partyBooking->contact_email)->send(
            new PartyBookingReceivedMail($partyBooking, $loginUrl),
        );
    }
}
