<?php

namespace App\Mail;

use App\Models\PendingEmailChange;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\URL;

class ConfirmEmailChangeMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public readonly string $confirmationUrl;

    public readonly int $expirationMinutes;

    public function __construct(
        PendingEmailChange $pendingEmailChange,
        string $plainTextToken,
    ) {
        $this->expirationMinutes = (int) config(
            'email_changes.expiration_minutes',
        );
        $this->confirmationUrl = URL::to(
            URL::temporarySignedRoute(
                'profile.email.confirm',
                $pendingEmailChange->expires_at,
                [
                    'pendingEmailChange' => $pendingEmailChange,
                    'token' => $plainTextToken,
                ],
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
            subject: 'Confirma o teu novo email na Color Fun Parks',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'mail.settings.confirm-email-change',
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
