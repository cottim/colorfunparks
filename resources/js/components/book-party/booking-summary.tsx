import { format, isValid, parseISO } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import type { BookingData } from '@/components/book-party/types';
import { cn } from '@/lib/utils';

type BookingSummaryProps = {
    data: BookingData;
    mobile?: boolean;
    review?: boolean;
    formId?: string;
    processing?: boolean;
    hasErrors?: boolean;
};

export function BookingSummary({
    data,
    mobile = false,
    review = false,
    formId,
    processing = false,
    hasErrors = false,
}: BookingSummaryProps) {
    const content = <BookingSummaryContent data={data} />;
    const submit = review ? (
        <BookingSubmit
            formId={formId}
            processing={processing}
            hasErrors={hasErrors}
        />
    ) : null;

    if (mobile) {
        if (review) {
            return (
                <section
                    className="rounded-2xl border border-[#558b6e]/40 bg-white p-5 shadow-lg lg:hidden"
                    aria-labelledby="booking-review-mobile-heading"
                >
                    <p className="text-xs font-semibold tracking-wide text-[#35634b] uppercase">
                        Último passo
                    </p>
                    <h2
                        id="booking-review-mobile-heading"
                        tabIndex={-1}
                        className="mt-1 text-xl font-bold outline-none"
                    >
                        Revê o teu pedido
                    </h2>
                    <div className="mt-5">{content}</div>
                    {submit}
                </section>
            );
        }

        return (
            <details className="group rounded-2xl border border-black/10 bg-white shadow-sm lg:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 font-bold">
                    Resumo do pedido
                    <ChevronDownIcon className="size-5 transition-transform group-open:rotate-180" />
                </summary>
                <div className="border-t border-black/10 p-4">{content}</div>
            </details>
        );
    }

    return (
        <aside className="sticky top-6 hidden rounded-2xl border border-black/10 bg-white p-6 shadow-lg lg:block">
            <p className="text-xs font-semibold tracking-wide text-[#35634b] uppercase">
                {review ? 'Último passo' : 'A preencher'}
            </p>
            <h2 className="mt-1 mb-5 text-xl font-bold">
                {review ? 'Revê o teu pedido' : 'Resumo do pedido'}
            </h2>
            {content}
            {submit}
        </aside>
    );
}

function BookingSummaryContent({ data }: { data: BookingData }) {
    const parsedPartyDate = data.partyDate
        ? parseISO(data.partyDate)
        : undefined;
    const formattedPartyDate =
        parsedPartyDate && isValid(parsedPartyDate)
            ? format(parsedPartyDate, 'dd/MM/yyyy')
            : 'Por escolher';
    const programChoices =
        data.program?.choiceGroups.flatMap((group) => {
            const selectedChoice = group.options.find(
                (option) => option.value === data.programChoices[group.value],
            );

            return selectedChoice
                ? [`${group.label}: ${selectedChoice.label}`]
                : [];
        }) ?? [];

    return (
        <div className="grid gap-5 text-sm">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
                <SummaryItem
                    label="Data pretendida"
                    value={formattedPartyDate}
                />
                <SummaryItem
                    label="Hora"
                    value={data.partyTime || 'Por escolher'}
                />
                <SummaryItem
                    label="Parque"
                    value={data.park?.label ?? 'Por escolher'}
                />
                <SummaryItem
                    label="Convidados"
                    value={data.guests || 'Por preencher'}
                />
                <SummaryItem
                    label="Programa"
                    value={data.program?.label ?? 'Por escolher'}
                    wide
                />
            </dl>

            <div className="grid gap-4 border-t border-black/10 pt-4 sm:grid-cols-2 lg:grid-cols-1">
                <SummaryGroup title="Criança">
                    <p className="font-semibold text-gray-900">
                        {data.child.name || 'Por preencher'}
                    </p>
                    <p className="text-gray-500">
                        {data.child.age
                            ? `${data.child.age} anos`
                            : 'Idade por preencher'}
                    </p>
                </SummaryGroup>

                <SummaryGroup title="Contacto">
                    <p className="font-semibold text-gray-900">
                        {data.contact.name || 'Por preencher'}
                    </p>
                    <p className="break-words text-gray-500">
                        {[data.contact.email, data.contact.phone]
                            .filter(Boolean)
                            .join(' · ') || 'Email ou telefone por preencher'}
                    </p>
                </SummaryGroup>
            </div>

            <SummaryGroup
                title="Escolhas do menu"
                className="border-t border-black/10 pt-4"
            >
                {programChoices.length > 0 ? (
                    <ul className="flex flex-wrap gap-2">
                        {programChoices.map((choice) => (
                            <li
                                key={choice}
                                className="rounded-full bg-[#558b6e]/10 px-3 py-1 font-medium text-[#35634b]"
                            >
                                {choice}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">Por escolher</p>
                )}
            </SummaryGroup>
        </div>
    );
}

function SummaryItem({
    label,
    value,
    wide = false,
}: {
    label: string;
    value: string;
    wide?: boolean;
}) {
    return (
        <div className={cn('min-w-0', wide && 'col-span-2')}>
            <dt className="text-xs text-gray-500">{label}</dt>
            <dd className="mt-0.5 truncate font-semibold text-gray-900">
                {value}
            </dd>
        </div>
    );
}

function SummaryGroup({
    title,
    children,
    className,
}: {
    title: string;
    children: ReactNode;
    className?: string;
}) {
    return (
        <section className={className}>
            <h3 className="mb-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                {title}
            </h3>
            {children}
        </section>
    );
}

function BookingSubmit({
    formId,
    processing,
    hasErrors,
}: {
    formId?: string;
    processing: boolean;
    hasErrors: boolean;
}) {
    return (
        <div className="mt-5 border-t border-black/10 pt-5">
            <p className="mb-4 text-sm leading-6 text-gray-600">
                Este é um pedido de marcação. A equipa confirmará a
                disponibilidade contigo.
            </p>
            <button
                type="submit"
                form={formId}
                disabled={processing}
                data-booking-submit
                className="inline-flex h-11 w-full items-center justify-center rounded-md bg-[#558b6e] px-6 text-sm font-semibold text-white shadow-md transition hover:bg-[#47775d] hover:shadow-lg focus-visible:ring-2 focus-visible:ring-[#558b6e] focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60"
            >
                {processing ? 'A enviar pedido…' : 'Enviar pedido de marcação'}
            </button>
            {hasErrors && (
                <p
                    role="status"
                    aria-live="polite"
                    className="mt-3 text-sm font-semibold text-[#35634b]"
                >
                    Não foi possível enviar. Revê os campos assinalados.
                </p>
            )}
        </div>
    );
}
