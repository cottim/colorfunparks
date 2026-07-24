import { format, isValid, parseISO } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';
import type { BookingData } from '@/components/book-party/types';

type BookingSummaryProps = {
    data: BookingData;
    mobile?: boolean;
};

export function BookingSummary({ data, mobile = false }: BookingSummaryProps) {
    const content = <BookingSummaryContent data={data} />;

    if (mobile) {
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
            <h2 className="mb-5 text-xl font-bold">Resumo do pedido</h2>
            {content}
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

    const rows = [
        ['Contacto', data.contact.name || 'Por preencher'],
        ['Parque', data.park?.label ?? 'Por escolher'],
        ['Criança', data.child.name || 'Por preencher'],
        ['Idade', data.child.age ? `${data.child.age} anos` : 'Por preencher'],
        ['Data', formattedPartyDate],
        ['Hora', data.partyTime || 'Por escolher'],
        ['Convidados', data.guests || 'Por preencher'],
        ['Programa', data.program?.label ?? 'Por escolher'],
    ];

    return (
        <dl className="grid gap-4 text-sm">
            {rows.map(([label, value]) => (
                <div
                    key={label}
                    className="flex items-start justify-between gap-4 border-b border-black/5 pb-3 last:border-0 last:pb-0"
                >
                    <dt className="text-gray-500">{label}</dt>
                    <dd className="text-right font-semibold text-gray-900">
                        {value}
                    </dd>
                </div>
            ))}
        </dl>
    );
}
