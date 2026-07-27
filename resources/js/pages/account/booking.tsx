import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeftIcon,
    CalendarDaysIcon,
    ClockIcon,
    MailIcon,
    MapPinIcon,
    PartyPopperIcon,
    PhoneIcon,
    UserRoundIcon,
    UsersIcon,
} from 'lucide-react';
import { CustomerBookingStatusBadge } from '@/components/customer-account/booking-status-badge';
import {
    customerBookingNextStep,
    formatCustomerBookingDate,
    formatCustomerBookingTime,
} from '@/components/customer-account/customer-booking-card';
import account from '@/routes/account';
import type { CustomerBooking } from '@/types/customer-account';

export default function CustomerBookingDetail({
    booking,
}: {
    booking: CustomerBooking;
}) {
    return (
        <>
            <Head title={`Pedido #${booking.id}`} />

            <Link
                href={account.bookings.index()}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#376b50] underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-[#376b50] focus-visible:outline-none"
            >
                <ArrowLeftIcon className="size-4" aria-hidden="true" />
                Voltar às minhas festas
            </Link>

            <header className="mt-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-bold tracking-wide text-[#558b6e] uppercase">
                        Pedido #{booking.id}
                    </p>
                    <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                        Festa de {booking.childName}
                    </h1>
                    <p className="mt-2 text-gray-600">
                        Pedido enviado em {formatSubmittedAt(booking.createdAt)}
                    </p>
                </div>

                <CustomerBookingStatusBadge status={booking.status}>
                    {booking.statusLabel}
                </CustomerBookingStatusBadge>
            </header>

            <section className="mt-8 rounded-3xl border border-[#558b6e]/25 bg-[#558b6e]/8 p-5 text-[#28583f] sm:p-6">
                <p className="text-sm font-black tracking-wide uppercase">
                    Próximo passo
                </p>
                <p className="mt-2 leading-7">
                    {customerBookingNextStep(booking.status)}
                </p>
            </section>

            <div className="mt-6 grid gap-6 xl:grid-cols-2">
                <BookingDetailsSection
                    title="Detalhes da festa"
                    description="Os dados submetidos no pedido."
                >
                    <Detail
                        icon={CalendarDaysIcon}
                        label="Data"
                        value={formatCustomerBookingDate(booking.partyDate)}
                    />
                    <Detail
                        icon={ClockIcon}
                        label="Hora"
                        value={formatCustomerBookingTime(booking.partyTime)}
                    />
                    <Detail
                        icon={MapPinIcon}
                        label="Parque"
                        value={booking.park}
                    />
                    <Detail
                        icon={PartyPopperIcon}
                        label="Programa"
                        value={booking.program ?? 'Por escolher'}
                    />
                    <Detail
                        icon={UsersIcon}
                        label="Convidados"
                        value={`${booking.guests} convidados`}
                    />
                    <Detail
                        icon={UserRoundIcon}
                        label="Criança"
                        value={`${booking.childName}, ${booking.childAge} anos`}
                    />
                </BookingDetailsSection>

                <BookingDetailsSection
                    title="Contactos"
                    description="É através destes dados que a equipa entra em contacto."
                >
                    <Detail
                        icon={MailIcon}
                        label="Email"
                        value={booking.contactEmail ?? 'Não indicado'}
                    />
                    <Detail
                        icon={PhoneIcon}
                        label="Telefone"
                        value={booking.contactPhone ?? 'Não indicado'}
                    />
                </BookingDetailsSection>
            </div>
        </>
    );
}

function BookingDetailsSection({
    title,
    description,
    children,
}: {
    title: string;
    description: string;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-black">{title}</h2>
            <p className="mt-1 text-sm text-gray-600">{description}</p>
            <dl className="mt-6 grid gap-5 sm:grid-cols-2">{children}</dl>
        </section>
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
                <dt className="text-xs font-semibold text-gray-500">{label}</dt>
                <dd className="mt-1 font-semibold break-words">{value}</dd>
            </div>
        </div>
    );
}

function formatSubmittedAt(value: string): string {
    return new Intl.DateTimeFormat('pt-PT', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(value));
}
