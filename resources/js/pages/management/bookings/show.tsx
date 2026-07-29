import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeftIcon,
    CakeSliceIcon,
    CalendarDaysIcon,
    ClockIcon,
    MailIcon,
    MapPinIcon,
    MessageSquareTextIcon,
    PartyPopperIcon,
    PhoneIcon,
    UserRoundIcon,
    UsersIcon,
} from 'lucide-react';
import {
    ManagementPageHeader,
    ManagementSection,
    StatusBadge,
} from '@/components/management/management-ui';
import { index as bookingsIndex } from '@/routes/management/bookings';
import type { ManagedPartyBooking } from '@/types/management';

export default function ManagementBooking({
    party_booking: booking,
}: {
    party_booking: ManagedPartyBooking;
}) {
    return (
        <>
            <Head title={booking.reference} />

            <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
                <Link
                    href={bookingsIndex()}
                    className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-[#558b6e] focus-visible:outline-none"
                >
                    <ArrowLeftIcon className="size-4" aria-hidden="true" />
                    Voltar às festas
                </Link>

                <ManagementPageHeader
                    eyebrow="Festa"
                    title={booking.reference}
                    description={`Pedido recebido em ${formatRequestDate(booking.created_at)} por ${booking.customer.name}.`}
                    action={<StatusBadge status={booking.status} />}
                />

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
                    <div className="grid content-start gap-6">
                        <ManagementSection
                            title="Detalhes da festa"
                            description="Informação submetida pelo cliente."
                        >
                            <dl className="grid gap-5 sm:grid-cols-2">
                                <Detail
                                    icon={CalendarDaysIcon}
                                    label="Data pretendida"
                                    value={formatPartyDate(booking.party_date)}
                                />
                                <Detail
                                    icon={ClockIcon}
                                    label="Hora pretendida"
                                    value={booking.party_time.slice(0, 5)}
                                />
                                <Detail
                                    icon={MapPinIcon}
                                    label="Parque"
                                    value={booking.park}
                                />
                                <Detail
                                    icon={PartyPopperIcon}
                                    label="Programa"
                                    value={booking.program}
                                />
                                <Detail
                                    icon={UsersIcon}
                                    label="Convidados"
                                    value={`${booking.guests} convidados`}
                                />
                                <Detail
                                    icon={UserRoundIcon}
                                    label="Criança"
                                    value={booking.child.name}
                                />
                                <Detail
                                    icon={CakeSliceIcon}
                                    label="Idade a celebrar"
                                    value={`${booking.child.age} anos`}
                                />
                            </dl>

                            {booking.program_choices &&
                                Object.keys(booking.program_choices).length >
                                    0 && (
                                    <div className="mt-6 border-t pt-5">
                                        <h3 className="text-sm font-semibold">
                                            Escolhas do programa
                                        </h3>
                                        <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                                            {Object.values(
                                                booking.program_choices,
                                            ).map((choice) => (
                                                <div
                                                    key={`${choice.group}-${choice.value}`}
                                                    className="rounded-lg bg-muted/60 px-3 py-2"
                                                >
                                                    <dt className="text-xs text-muted-foreground">
                                                        {choice.group}
                                                    </dt>
                                                    <dd className="mt-1 font-medium">
                                                        {choice.label}
                                                    </dd>
                                                </div>
                                            ))}
                                        </dl>
                                    </div>
                                )}
                        </ManagementSection>

                        <ManagementSection
                            title="Atividade e comunicação"
                            description="Este será o registo central das propostas, alterações e mensagens desta festa."
                        >
                            <div className="flex gap-3 rounded-xl border border-dashed p-4">
                                <MessageSquareTextIcon
                                    className="mt-0.5 size-5 shrink-0 text-[#558b6e]"
                                    aria-hidden="true"
                                />
                                <div>
                                    <p className="font-semibold">
                                        Pedido recebido
                                    </p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        O histórico de negociação e as mensagens
                                        serão adicionados aqui na próxima fase.
                                    </p>
                                </div>
                            </div>
                        </ManagementSection>
                    </div>

                    <aside className="grid content-start gap-6">
                        <ManagementSection
                            title="Cliente"
                            description="Contactos associados ao pedido."
                        >
                            <dl className="grid gap-5">
                                <Detail
                                    icon={UserRoundIcon}
                                    label="Nome"
                                    value={booking.customer.name}
                                />
                                <Detail
                                    icon={MailIcon}
                                    label="Email"
                                    value={booking.customer.email}
                                />
                                <Detail
                                    icon={PhoneIcon}
                                    label="Telefone"
                                    value={
                                        booking.customer.phone ?? 'Não indicado'
                                    }
                                />
                            </dl>
                        </ManagementSection>

                        <ManagementSection
                            title="Pagamento"
                            description="Valores ainda não são calculados pelo sistema."
                        >
                            <dl className="grid gap-4 text-sm">
                                <SummaryRow
                                    label="Total"
                                    value={formatTotal(booking.total_cents)}
                                />
                                <SummaryRow
                                    label="Estado"
                                    value={
                                        booking.payment_status?.label ??
                                        'Por definir'
                                    }
                                />
                            </dl>
                        </ManagementSection>
                    </aside>
                </div>
            </div>
        </>
    );
}

function Detail({
    icon: Icon,
    label,
    value,
}: {
    icon: typeof CalendarDaysIcon;
    label: string;
    value: string;
}) {
    return (
        <div className="flex gap-3">
            <Icon
                className="mt-0.5 size-4 shrink-0 text-[#558b6e]"
                aria-hidden="true"
            />
            <div>
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd className="mt-1 font-semibold break-words">{value}</dd>
            </div>
        </div>
    );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="text-right font-semibold">{value}</dd>
        </div>
    );
}

function formatRequestDate(value: string | null): string {
    if (!value) {
        return 'data desconhecida';
    }

    return new Intl.DateTimeFormat('pt-PT', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value));
}

function formatPartyDate(value: string): string {
    return new Intl.DateTimeFormat('pt-PT', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(`${value}T00:00:00`));
}

function formatTotal(totalCents: number | null): string {
    if (totalCents === null) {
        return 'Por definir';
    }

    return new Intl.NumberFormat('pt-PT', {
        style: 'currency',
        currency: 'EUR',
    }).format(totalCents / 100);
}

ManagementBooking.layout = {
    breadcrumbs: [
        {
            title: 'Festas',
            href: bookingsIndex(),
        },
        {
            title: 'Detalhes',
            href: bookingsIndex(),
        },
    ],
};
