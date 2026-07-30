import { Form, Head, Link } from '@inertiajs/react';
import {
    CalendarCheckIcon,
    CheckCircle2Icon,
    CreditCardIcon,
    FileTextIcon,
    MailCheckIcon,
    MailPlusIcon,
    ShieldCheckIcon,
    SparklesIcon,
} from 'lucide-react';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { store as acceptLegalConsent } from '@/routes/account/preferences/legal-consent';
import {
    destroy as unsubscribeFromMarketing,
    store as subscribeToMarketing,
} from '@/routes/account/preferences/marketing';
import { privacyPolicy, termsAndConditions } from '@/routes/legal';
import { playCard } from '@/routes/services';

type MarketingStatus = 'not-authorized' | 'pending' | 'authorized';
type PlayCardStatus = 'inactive' | 'active' | 'promotion-unlocked';
type LegalStatus = 'accepted' | 'required';

type CustomerPreferencesProps = {
    preferences: {
        marketing: {
            status: MarketingStatus;
            label: string;
            isAuthorized: boolean;
        };
        legal: {
            status: LegalStatus;
            label: string;
            privacyAcceptedAt: string | null;
            termsAcceptedAt: string | null;
        };
        playCard: {
            status: PlayCardStatus;
            label: string;
            joinedAt: string | null;
            lastUsedAt: string | null;
            benefitsActiveUntil: string | null;
            benefitsBasedOn: 'account-creation' | 'last-use' | null;
        };
    };
};

const dateFormatter = new Intl.DateTimeFormat('pt-PT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
});

function formatDate(date: string) {
    return dateFormatter.format(new Date(`${date}T00:00:00Z`));
}

export default function CustomerPreferences({
    preferences,
}: CustomerPreferencesProps) {
    const { legal, marketing, playCard: playCardPreference } = preferences;

    return (
        <>
            <Head title="Preferências" />

            <header>
                <p className="text-sm font-bold tracking-wide text-[#558b6e] uppercase">
                    Área de cliente
                </p>
                <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                    Preferências
                </h1>
                <p className="mt-2 max-w-2xl text-gray-600">
                    Consulta os consentimentos associados à tua conta, gere as
                    comunicações que queres receber e acompanha o teu Cartão da
                    Brincadeira.
                </p>
            </header>

            <div className="mt-8 grid gap-6 xl:grid-cols-2">
                <section className="flex rounded-3xl border border-black/10 bg-white/80 p-5 shadow-sm sm:p-7">
                    <div className="flex w-full flex-col">
                        <div className="flex items-start justify-between gap-4 border-b border-black/10 pb-5">
                            <div className="flex items-start gap-3">
                                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#558b6e]/10 text-[#376b50]">
                                    <MailCheckIcon aria-hidden="true" />
                                </span>
                                <div>
                                    <h2 className="text-xl font-black">
                                        Emails de marketing
                                    </h2>
                                    <p className="mt-1 text-sm leading-6 text-gray-600">
                                        Novidades, iniciativas e campanhas da
                                        Color Fun Parks.
                                    </p>
                                </div>
                            </div>
                            <StatusBadge
                                status={marketing.status}
                                label={marketing.label}
                            />
                        </div>

                        {marketing.isAuthorized ? (
                            <div className="mt-6 flex flex-1 flex-col">
                                <div className="flex gap-3 rounded-2xl bg-emerald-50 p-4 text-emerald-900">
                                    <CheckCircle2Icon
                                        className="mt-0.5 size-5 shrink-0"
                                        aria-hidden="true"
                                    />
                                    <div>
                                        <h3 className="font-bold">
                                            Estás a receber as nossas novidades
                                        </h3>
                                        <p className="mt-1 text-sm leading-6 text-emerald-800">
                                            O teu email foi confirmado para
                                            comunicações de marketing.
                                        </p>
                                    </div>
                                </div>

                                <Form
                                    {...unsubscribeFromMarketing.form()}
                                    options={{ preserveScroll: true }}
                                    className="mt-auto pt-6"
                                >
                                    {({ processing }) => (
                                        <Button
                                            type="submit"
                                            variant="outline"
                                            disabled={processing}
                                            className="rounded-xl"
                                        >
                                            {processing
                                                ? 'A guardar…'
                                                : 'Deixar de receber'}
                                        </Button>
                                    )}
                                </Form>
                            </div>
                        ) : (
                            <div className="mt-6 flex flex-1 flex-col">
                                <div className="flex gap-3">
                                    <MailPlusIcon
                                        className="mt-0.5 size-5 shrink-0 text-[#376b50]"
                                        aria-hidden="true"
                                    />
                                    <div>
                                        <h3 className="font-bold">
                                            Recebe as últimas novidades
                                        </h3>
                                        <p className="mt-1 text-sm leading-6 text-gray-600">
                                            {marketing.status === 'pending'
                                                ? 'Falta confirmar a subscrição. Verifica o teu email ou pede uma nova mensagem.'
                                                : 'Fica a par das próximas atividades, campanhas e novidades dos parques.'}
                                        </p>
                                    </div>
                                </div>

                                <Form
                                    {...subscribeToMarketing.form()}
                                    options={{ preserveScroll: true }}
                                    className="mt-auto pt-6"
                                >
                                    {({ processing }) => (
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="rounded-xl bg-[#558b6e] text-white hover:bg-[#376b50]"
                                        >
                                            {processing
                                                ? 'A enviar…'
                                                : marketing.status === 'pending'
                                                  ? 'Reenviar confirmação'
                                                  : 'Quero receber novidades'}
                                        </Button>
                                    )}
                                </Form>
                            </div>
                        )}
                    </div>
                </section>

                <section className="flex rounded-3xl border border-black/10 bg-white/80 p-5 shadow-sm sm:p-7">
                    <div className="flex w-full flex-col">
                        <div className="flex items-start justify-between gap-4 border-b border-black/10 pb-5">
                            <div className="flex items-start gap-3">
                                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                                    <CreditCardIcon aria-hidden="true" />
                                </span>
                                <div>
                                    <h2 className="text-xl font-black">
                                        Cartão da Brincadeira
                                    </h2>
                                    <p className="mt-1 text-sm leading-6 text-gray-600">
                                        Mais opções, extras e vantagens para
                                        quem volta ao parque.
                                    </p>
                                </div>
                            </div>
                            <StatusBadge
                                status={playCardPreference.status}
                                label={playCardPreference.label}
                            />
                        </div>

                        <PlayCardStatusPanel
                            status={playCardPreference.status}
                            lastUsedAt={playCardPreference.lastUsedAt}
                            benefitsActiveUntil={
                                playCardPreference.benefitsActiveUntil
                            }
                            benefitsBasedOn={playCardPreference.benefitsBasedOn}
                        />

                        {playCardPreference.status === 'inactive' ? (
                            <div className="mt-auto pt-6">
                                <Button
                                    asChild
                                    variant="outline"
                                    className="rounded-xl"
                                >
                                    <Link href={playCard()}>
                                        Conhecer as vantagens
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="mt-auto pt-6 text-sm text-gray-500">
                                Membro desde{' '}
                                {formatDate(playCardPreference.joinedAt!)}
                            </div>
                        )}
                    </div>
                </section>

                <section className="rounded-3xl border border-black/10 bg-white/80 p-5 shadow-sm sm:p-7 xl:col-span-2">
                    <div className="flex flex-col gap-5 border-b border-black/10 pb-5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex items-start gap-3">
                            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                                <ShieldCheckIcon aria-hidden="true" />
                            </span>
                            <div>
                                <h2 className="text-xl font-black">
                                    Privacidade e termos
                                </h2>
                                <p className="mt-1 text-sm leading-6 text-gray-600">
                                    Documentos obrigatórios associados à tua
                                    conta e aos pedidos efetuados no site.
                                </p>
                            </div>
                        </div>
                        <StatusBadge
                            status={legal.status}
                            label={legal.label}
                        />
                    </div>

                    <div
                        className={`mt-6 flex gap-3 rounded-2xl p-4 ${
                            legal.status === 'accepted'
                                ? 'bg-emerald-50 text-emerald-900'
                                : 'bg-amber-50 text-amber-950'
                        }`}
                    >
                        <CheckCircle2Icon
                            className="mt-0.5 size-5 shrink-0"
                            aria-hidden="true"
                        />
                        <div>
                            <h3 className="font-bold">
                                {legal.status === 'accepted'
                                    ? 'Consentimentos atualizados'
                                    : 'Aceitação pendente'}
                            </h3>
                            <p className="mt-1 text-sm leading-6">
                                {legal.status === 'accepted'
                                    ? 'A tua conta tem a versão atual destes documentos aceite.'
                                    : 'Revê os documentos abaixo e confirma as duas aceitações para atualizares a tua conta.'}
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <LegalDocument
                            href={privacyPolicy()}
                            title="Política de Privacidade"
                            acceptedAt={legal.privacyAcceptedAt}
                        />
                        <LegalDocument
                            href={termsAndConditions()}
                            title="Termos e Condições"
                            acceptedAt={legal.termsAcceptedAt}
                        />
                    </div>

                    {legal.status === 'required' && (
                        <Form
                            {...acceptLegalConsent.form()}
                            options={{ preserveScroll: true }}
                            className="mt-6 grid gap-4 rounded-2xl border border-amber-200 bg-amber-50/60 p-4 sm:p-5"
                        >
                            {({ errors, processing }) => (
                                <>
                                    <LegalConsentField
                                        id="preferences-privacy-accepted"
                                        name="privacy_accepted"
                                        error={errors.privacy_accepted}
                                    >
                                        Li e aceito a{' '}
                                        <Link
                                            href={privacyPolicy()}
                                            className="font-bold underline underline-offset-4"
                                        >
                                            Política de Privacidade
                                        </Link>
                                        .
                                    </LegalConsentField>
                                    <LegalConsentField
                                        id="preferences-terms-accepted"
                                        name="terms_accepted"
                                        error={errors.terms_accepted}
                                    >
                                        Li e aceito os{' '}
                                        <Link
                                            href={termsAndConditions()}
                                            className="font-bold underline underline-offset-4"
                                        >
                                            Termos e Condições
                                        </Link>
                                        .
                                    </LegalConsentField>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="mt-1 justify-self-start bg-[#558b6e] text-white hover:bg-[#47765d] focus-visible:ring-[#558b6e]/40"
                                    >
                                        {processing
                                            ? 'A guardar…'
                                            : 'Aceitar e guardar'}
                                    </Button>
                                </>
                            )}
                        </Form>
                    )}
                </section>
            </div>
        </>
    );
}

function StatusBadge({
    status,
    label,
}: {
    status: MarketingStatus | PlayCardStatus | LegalStatus;
    label: string;
}) {
    const statusClasses =
        status === 'authorized' ||
        status === 'promotion-unlocked' ||
        status === 'accepted'
            ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
            : status === 'active' ||
                status === 'pending' ||
                status === 'required'
              ? 'border-amber-200 bg-amber-50 text-amber-800'
              : 'border-gray-200 bg-gray-50 text-gray-700';

    return (
        <Badge
            variant="outline"
            className={`shrink-0 rounded-full px-3 py-1 ${statusClasses}`}
        >
            {label}
        </Badge>
    );
}

function LegalDocument({
    href,
    title,
    acceptedAt,
}: {
    href: ReturnType<typeof privacyPolicy>;
    title: string;
    acceptedAt: string | null;
}) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white p-4 transition hover:border-[#558b6e]/40 hover:bg-[#558b6e]/5 focus-visible:ring-2 focus-visible:ring-[#558b6e]/40 focus-visible:outline-none"
        >
            <FileTextIcon
                className="size-5 shrink-0 text-[#376b50]"
                aria-hidden="true"
            />
            <span>
                <span className="block font-bold text-gray-900">{title}</span>
                <span className="mt-0.5 block text-sm text-gray-500">
                    {acceptedAt
                        ? `Aceite em ${formatDate(acceptedAt)}`
                        : 'Aceitação pendente'}
                </span>
            </span>
        </Link>
    );
}

function LegalConsentField({
    id,
    name,
    error,
    children,
}: {
    id: string;
    name: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="grid gap-2">
            <label
                htmlFor={id}
                className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-amber-950"
            >
                <input
                    id={id}
                    name={name}
                    value="1"
                    type="checkbox"
                    required
                    aria-invalid={Boolean(error)}
                    className="mt-1 size-4 shrink-0 accent-[#558b6e]"
                />
                <span>{children}</span>
            </label>
            <InputError message={error} />
        </div>
    );
}

function PlayCardStatusPanel({
    status,
    lastUsedAt,
    benefitsActiveUntil,
    benefitsBasedOn,
}: {
    status: PlayCardStatus;
    lastUsedAt: string | null;
    benefitsActiveUntil: string | null;
    benefitsBasedOn: 'account-creation' | 'last-use' | null;
}) {
    if (status === 'promotion-unlocked' && benefitsActiveUntil) {
        return (
            <div className="mt-6 flex gap-3 rounded-2xl bg-emerald-50 p-4 text-emerald-900">
                <SparklesIcon
                    className="mt-0.5 size-5 shrink-0"
                    aria-hidden="true"
                />
                <div>
                    <h3 className="font-bold">Benefícios ativos</h3>
                    <p className="mt-1 text-sm leading-6 text-emerald-800">
                        {benefitsBasedOn === 'last-use' && lastUsedAt
                            ? `A utilização de ${formatDate(lastUsedAt)} mantém os benefícios ativos até ${formatDate(benefitsActiveUntil)}.`
                            : `A criação da tua conta oferece benefícios ativos até ${formatDate(benefitsActiveUntil)}.`}
                    </p>
                </div>
            </div>
        );
    }

    if (status === 'active') {
        return (
            <div className="mt-6 flex gap-3 rounded-2xl bg-amber-50 p-4 text-amber-950">
                <CalendarCheckIcon
                    className="mt-0.5 size-5 shrink-0"
                    aria-hidden="true"
                />
                <div>
                    <h3 className="font-bold">Cartão ativo</h3>
                    <p className="mt-1 text-sm leading-6 text-amber-900">
                        Neste momento não existem benefícios promocionais
                        ativos. Cada nova utilização volta a ativá-los durante
                        30 dias.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-6">
            <h3 className="font-bold">Cartão inativo</h3>
            <p className="mt-1 text-sm leading-6 text-gray-600">
                A adesão está associada à tua conta, mas o cartão encontra-se
                desativado. Contacta a nossa equipa se precisares de ajuda.
            </p>
        </div>
    );
}
