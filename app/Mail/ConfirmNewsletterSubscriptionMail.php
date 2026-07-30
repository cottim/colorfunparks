<?php

namespace App\Mail;

use App\Models\NewsletterSubscription;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Headers;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\URL;

class ConfirmNewsletterSubscriptionMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public readonly string $confirmationUrl;

    public readonly string $unsubscribeUrl;

    public readonly int $expirationMinutes;

    public function __construct(
        NewsletterSubscription $subscription,
        string $plainTextToken,
    ) {
        $this->expirationMinutes = (int) config(
            'newsletter.confirmation_expiration_minutes',
        );
        $this->confirmationUrl = URL::temporarySignedRoute(
            'newsletter-subscriptions.confirm',
            now()->addMinutes($this->expirationMinutes),
            [
                'newsletterSubscription' => $subscription,
                'token' => $plainTextToken,
            ],
        );
        $this->unsubscribeUrl = URL::signedRoute(
            'newsletter-subscriptions.unsubscribe',
            ['newsletterSubscription' => $subscription],
        );
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Confirma a tua inscrição na Color Fun Parks',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'mail.newsletter.confirm-subscription',
        );
    }

    /**
     * Get the message headers.
     */
    public function headers(): Headers
    {
        return new Headers(
            text: [
                'List-Unsubscribe' => '<'.$this->unsubscribeUrl.'>',
                'List-Unsubscribe-Post' => 'List-Unsubscribe=One-Click',
            ],
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
