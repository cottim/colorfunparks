import { Link, useHttp } from '@inertiajs/react';
import { MailIcon } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import NewsletterSubscriptionController from '@/actions/App/Http/Controllers/NewsletterSubscriptionController';
import InputError from '@/components/input-error';
import { CtaButton } from '@/components/ui/cta-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { privacyPolicy } from '@/routes/legal';

type NewsletterData = {
    email: string;
    privacy_consent: boolean;
};

type NewsletterResponse = {
    message: string;
};

type Feedback = {
    type: 'success' | 'error';
    message: string;
};

export function NewsletterSection() {
    const { data, setData, post, reset, errors, processing } = useHttp<
        NewsletterData,
        NewsletterResponse
    >({
        email: '',
        privacy_consent: false,
    });
    const [feedback, setFeedback] = useState<Feedback | null>(null);

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        post(NewsletterSubscriptionController.url(), {
            onBefore: () => setFeedback(null),
            onSuccess: (response) => {
                reset();
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

    return (
        <section
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

                    <form
                        onSubmit={submit}
                        className="rounded-2xl bg-white p-5 text-gray-900 shadow-lg sm:p-6"
                    >
                        <div className="grid gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="newsletter-email">Email</Label>
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
                                        Aceito receber comunicações da Color Fun
                                        Parks e confirmo que li a{' '}
                                        <Link
                                            href={privacyPolicy()}
                                            className="font-semibold text-green-800 underline underline-offset-4"
                                        >
                                            Política de Privacidade
                                        </Link>
                                        .
                                    </Label>
                                </div>
                                <InputError message={errors.privacy_consent} />
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
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
