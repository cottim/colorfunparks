<?php

namespace App\Mail;

use App\Models\PartyBooking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PartyBookingReceivedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public readonly int $loginLinkExpirationMinutes;

    public function __construct(
        public readonly PartyBooking $partyBooking,
        public readonly ?string $loginUrl,
    ) {
        $this->loginLinkExpirationMinutes = (int) config(
            'customer_auth.login_link_expiration_minutes',
        );

        $this->afterCommit();
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Recebemos o teu pedido de festa '
                .$this->partyBooking->reference(),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'mail.party-bookings.received',
        );
    }
}
