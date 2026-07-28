import { Link } from '@inertiajs/react';
import {
    CalendarDaysIcon,
    ChevronRightIcon,
    MapPinIcon,
    PartyPopperIcon,
    UsersIcon,
} from 'lucide-react';
import { CustomerBookingStatusBadge } from '@/components/customer-account/booking-status-badge';
import { cn } from '@/lib/utils';
import account from '@/routes/account';
import type {
    CustomerBooking,
    CustomerBookingStatus,
} from '@/types/customer-account';

export function CustomerBookingCard({
    booking,
    showNextStep = false,
}: {
    booking: CustomerBooking;
    showNextStep?: boolean;
}) {
    return (
        <Link
            href={account.bookings.show(booking.id)}
            prefetch
            className="group block rounded-3xl focus-visible:ring-2 focus-visible:ring-[#376b50] focus-visible:ring-offset-2 focus-visible:outline-none"
        >
            <article
                className={cn(
                    'rounded-3xl border border-black/10 bg-white p-5 shadow-sm transition group-hover:-translate-y-0.5 group-hover:border-[#558b6e]/40 group-hover:shadow-md sm:p-6',
                    showNextStep && 'border-[#558b6e]/30',
                )}
            >
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <p className="text-xs font-bold tracking-wide text-gray-500 uppercase">
                            Festa {booking.reference}
                        </p>
                        <h3 className="mt-1 text-lg font-black">
                            Festa de {booking.childName}
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <CustomerBookingStatusBadge status={booking.status}>
                            {booking.statusLabel}
                        </CustomerBookingStatusBadge>
                        <ChevronRightIcon
                            className="size-4 text-gray-400 transition-transform group-hover:translate-x-0.5"
                            aria-hidden="true"
                        />
                    </div>
                </div>

                <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                    <BookingDetail
                        icon={CalendarDaysIcon}
                        label="Data e hora"
                        value={`${formatCustomerBookingDate(booking.partyDate)} às ${formatCustomerBookingTime(booking.partyTime)}`}
                    />
                    <BookingDetail
                        icon={MapPinIcon}
                        label="Parque"
                        value={booking.park}
                    />
                    <BookingDetail
                        icon={UsersIcon}
                        label="Convidados"
                        value={`${booking.guests} convidados`}
                    />
                    <BookingDetail
                        icon={PartyPopperIcon}
                        label="Programa"
                        value={booking.program ?? 'Por escolher'}
                    />
                </dl>

                {showNextStep && (
                    <div className="mt-5 rounded-2xl bg-[#558b6e]/8 px-4 py-3 text-sm leading-6 text-[#28583f]">
                        <span className="font-bold">Próximo passo: </span>
                        {customerBookingNextStep(booking.status)}
                    </div>
                )}
            </article>
        </Link>
    );
}

function BookingDetail({
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
                <dd className="mt-0.5 font-medium">{value}</dd>
            </div>
        </div>
    );
}

export function customerBookingNextStep(status: CustomerBookingStatus): string {
    switch (status) {
        case 'pending':
            return 'a nossa equipa vai analisar o pedido e entrar em contacto.';
        case 'contacted':
            return 'consulta a última mensagem da nossa equipa e responde quando puderes.';
        case 'confirmed':
            return 'a festa está confirmada. Podes rever os detalhes sempre que precisares.';
        case 'cancelled':
            return 'este pedido foi cancelado.';
    }
}

export function formatCustomerBookingDate(value: string): string {
    return new Intl.DateTimeFormat('pt-PT', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(new Date(`${value}T00:00:00`));
}

export function formatCustomerBookingTime(value: string): string {
    return value.slice(0, 5);
}
