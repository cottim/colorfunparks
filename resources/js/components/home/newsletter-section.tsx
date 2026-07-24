import { Link, useHttp } from '@inertiajs/react';
import { CheckCircle2Icon, MailIcon } from 'lucide-react';
import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import type { FormEvent } from 'react';
import NewsletterSubscriptionController from '@/actions/App/Http/Controllers/NewsletterSubscriptionController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { CtaButton } from '@/components/ui/cta-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { privacyPolicy } from '@/routes/legal';

type NewsletterData = {
    email: string;
    privacy_consent: boolean;
    website: string;
};

type NewsletterResponse = {
    message: string;
    masked_email: string;
    expiration_minutes: number;
};

type Feedback = {
    type: 'success' | 'error';
    message: string;
};

type SavedNewsletterSubmission = {
    status: 'pending' | 'confirmed';
    email: string;
    maskedEmail: string;
    expirationMinutes?: number;
};

const newsletterStorageKey = 'color-fun-parks.newsletter-submission.v1';
const newsletterStorageEvent = 'newsletter-submission-changed';

function subscribeToNewsletterStorage(callback: () => void) {
    function handleStorage(event: StorageEvent) {
        if (event.key === newsletterStorageKey) {
            callback();
        }
    }

    window.addEventListener('storage', handleStorage);
    window.addEventListener(newsletterStorageEvent, callback);

    return () => {
        window.removeEventListener('storage', handleStorage);
        window.removeEventListener(newsletterStorageEvent, callback);
    };
}

function getNewsletterStorageSnapshot() {
    return window.localStorage.getItem(newsletterStorageKey);
}

function saveNewsletterSubmission(submission: SavedNewsletterSubmission) {
    window.localStorage.setItem(
        newsletterStorageKey,
        JSON.stringify(submission),
    );
    window.dispatchEvent(new Event(newsletterStorageEvent));
}

function removeNewsletterSubmission() {
    window.localStorage.removeItem(newsletterStorageKey);
    window.dispatchEvent(new Event(newsletterStorageEvent));
}

function parseNewsletterSubmission(
    storedValue: string | null,
): SavedNewsletterSubmission | null {
    if (storedValue === null) {
        return null;
    }

    try {
        return JSON.parse(storedValue) as SavedNewsletterSubmission;
    } catch {
        return null;
    }
}

export function NewsletterSection() {
    const { data, setData, transform, post, reset, errors, processing } =
        useHttp<NewsletterData, NewsletterResponse>({
            email: '',
            privacy_consent: false,
            website: '',
        });
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const storedSubmission = useSyncExternalStore(
        subscribeToNewsletterStorage,
        getNewsletterStorageSnapshot,
        () => null,
    );
    const savedSubmission = useMemo(
        () => parseNewsletterSubmission(storedSubmission),
        [storedSubmission],
    );

    useEffect(() => {
        if (
            new URLSearchParams(window.location.search).get('newsletter') ===
            'confirmed'
        ) {
            const currentSubmission = parseNewsletterSubmission(
                getNewsletterStorageSnapshot(),
            );

            saveNewsletterSubmission({
                status: 'confirmed',
                email: currentSubmission?.email ?? '',
                maskedEmail: currentSubmission?.maskedEmail ?? '',
                expirationMinutes: currentSubmission?.expirationMinutes,
            });
            window.history.replaceState(
                {},
                '',
                `${window.location.pathname}${window.location.hash}`,
            );
        }
    }, []);

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        sendSubscription();
    }

    function sendSubscription() {
        const email = savedSubmission?.email || data.email;

        transform((formData) => ({
            ...formData,
            email,
            privacy_consent: savedSubmission ? true : formData.privacy_consent,
        }));

        post(NewsletterSubscriptionController.url(), {
            onBefore: () => setFeedback(null),
            onSuccess: (response) => {
                const submission: SavedNewsletterSubmission = {
                    status: 'pending',
                    email,
                    maskedEmail: response.masked_email,
                    expirationMinutes: response.expiration_minutes,
                };

                saveNewsletterSubmission(submission);
                setFeedback({
                    type: 'success',
                    message: response.message,
                });
            },
            onError: () => setFeedback(null),
            onNetworkError: () =>
                setFeedback({
                    type: 'error',
                    message:
                        'Sem ligação à internet. Verifica a ligação e tenta novamente.',
                }),
            onHttpException: () =>
                setFeedback({
                    type: 'error',
                    message:
                        'Não foi possível concluir a inscrição. Tenta novamente dentro de alguns instantes.',
                }),
        });
    }

    function correctEmail() {
        removeNewsletterSubmission();
        setFeedback(null);
        reset();
    }

    return (
        <section
            id="newsletter"
            aria-labelledby="newsletter-title"
            className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8"
        >
            <div className="overflow-hidden rounded-3xl bg-[#558b6e] text-white shadow-xl">
                <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:p-12">
                    <div className="space-y-4">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-white/15">
                            <MailIcon className="size-6" aria-hidden="true" />
                        </div>
                        <h2
                            id="newsletter-title"
                            className="text-3xl font-black tracking-tight sm:text-4xl"
                        >
                            Novidades cheias de cor
                        </h2>
                        <p className="max-w-xl leading-7 text-green-50">
                            Recebe novidades sobre atividades, campanhas e
                            momentos especiais nos nossos parques.
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-5 text-gray-900 shadow-lg sm:p-6">
                        {savedSubmission ? (
                            <div
                                className="grid gap-5"
                                role="status"
                                aria-live="polite"
                            >
                                <CheckCircle2Icon
                                    className="size-10 text-[#558b6e]"
                                    aria-hidden="true"
                                />
                                <div className="grid gap-2">
                                    <h3 className="text-xl font-bold">
                                        {savedSubmission.status === 'confirmed'
                                            ? 'Subscrição confirmada'
                                            : 'Confirma a tua inscrição'}
                                    </h3>
                                    <p className="text-sm leading-6 text-gray-600">
                                        {savedSubmission.status === 'confirmed'
                                            ? 'Já estás na nossa lista de novidades.'
                                            : `Se a inscrição ainda estiver por confirmar, receberás um email em ${savedSubmission.maskedEmail}.`}
                                    </p>
                                    {savedSubmission.status === 'pending' && (
                                        <p className="text-xs leading-5 text-gray-500">
                                            {savedSubmission.expirationMinutes
                                                ? `O link é válido durante ${savedSubmission.expirationMinutes} minutos. `
                                                : ''}
                                            Podes pedir outro email após alguns
                                            minutos.
                                        </p>
                                    )}
                                </div>

                                {savedSubmission.status === 'pending' && (
                                    <div className="flex flex-col gap-3 sm:flex-row">
                                        <Button
                                            type="button"
                                            disabled={processing}
                                            onClick={sendSubscription}
                                            className="bg-[#558b6e] text-white hover:bg-[#47775d]"
                                        >
                                            {processing && <Spinner />}
                                            Reenviar email
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            disabled={processing}
                                            onClick={correctEmail}
                                        >
                                            Introduzi o email errado
                                        </Button>
                                    </div>
                                )}

                                {feedback?.type === 'error' && (
                                    <p
                                        role="alert"
                                        className="text-sm font-semibold text-red-600"
                                    >
                                        {feedback.message}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <form onSubmit={submit} className="grid gap-5">
                                <div className="grid gap-2">
                                    <Label htmlFor="newsletter-email">
                                        Email
                                    </Label>
                                    <Input
                                        id="newsletter-email"
                                        name="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(event) =>
                                            setData('email', event.target.value)
                                        }
                                        autoComplete="email"
                                        inputMode="email"
                                        placeholder="nome@exemplo.pt"
                                        required
                                        aria-invalid={
                                            errors.email ? true : undefined
                                        }
                                        className="h-11 bg-white"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <div className="flex items-start gap-3">
                                        <input
                                            id="newsletter-privacy-consent"
                                            name="privacy_consent"
                                            type="checkbox"
                                            checked={data.privacy_consent}
                                            onChange={(event) =>
                                                setData(
                                                    'privacy_consent',
                                                    event.target.checked,
                                                )
                                            }
                                            required
                                            aria-invalid={
                                                errors.privacy_consent
                                                    ? true
                                                    : undefined
                                            }
                                            className="mt-1 size-4 shrink-0 accent-red-500"
                                        />
                                        <Label
                                            htmlFor="newsletter-privacy-consent"
                                            className="block text-sm leading-6 font-normal"
                                        >
                                            Aceito receber comunicações da Color
                                            Fun Parks e confirmo que li a{' '}
                                            <Link
                                                href={privacyPolicy()}
                                                className="font-semibold text-green-800 underline underline-offset-4"
                                            >
                                                Política de Privacidade
                                            </Link>
                                            .
                                        </Label>
                                    </div>
                                    <InputError
                                        message={errors.privacy_consent}
                                    />
                                </div>

                                <div
                                    className="absolute top-auto -left-[10000px] size-px overflow-hidden"
                                    aria-hidden="true"
                                >
                                    <Label htmlFor="newsletter-website">
                                        Website
                                    </Label>
                                    <Input
                                        id="newsletter-website"
                                        name="website"
                                        type="text"
                                        value={data.website}
                                        onChange={(event) =>
                                            setData(
                                                'website',
                                                event.target.value,
                                            )
                                        }
                                        tabIndex={-1}
                                        autoComplete="off"
                                    />
                                </div>

                                <CtaButton
                                    type="submit"
                                    attention="shine"
                                    disabled={processing}
                                    className="h-11 w-full sm:w-fit"
                                    data-test="newsletter-submit"
                                >
                                    {processing && <Spinner />}
                                    Quero receber novidades
                                </CtaButton>

                                <p
                                    role={
                                        feedback?.type === 'error'
                                            ? 'alert'
                                            : 'status'
                                    }
                                    aria-live="polite"
                                    className={`min-h-5 text-sm font-semibold ${
                                        feedback?.type === 'error'
                                            ? 'text-red-600'
                                            : 'text-green-700'
                                    }`}
                                >
                                    {feedback?.message}
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
