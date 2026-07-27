<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\URL;

class CustomerLoginLinkMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public readonly string $loginUrl;

    public readonly int $expirationMinutes;

    public function __construct(string $plainTextToken)
    {
        $this->expirationMinutes = (int) config(
            'customer_auth.login_link_expiration_minutes',
        );
        $this->loginUrl = URL::to(
            URL::temporarySignedRoute(
                'customer-login.authenticate',
                now()->addMinutes($this->expirationMinutes),
                ['token' => $plainTextToken],
                absolute: false,
            ),
        );

        $this->afterCommit();
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'O teu acesso à Color Fun Parks',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'mail.customer.login-link',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
