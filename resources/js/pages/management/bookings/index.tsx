import { Head, Link } from '@inertiajs/react';
import {
    EmptyState,
    ManagementPageHeader,
    ManagementSection,
    PaginationNav,
    StatusBadge,
} from '@/components/management/management-ui';
import {
    index as bookingsIndex,
    show as bookingShow,
} from '@/routes/management/bookings';
import type { ManagedPartyBooking, Pagination } from '@/types/management';

export default function ManagementBookings({
    party_bookings: partyBookings,
}: {
    party_bookings: Pagination<ManagedPartyBooking>;
}) {
    return (
        <>
            <Head title="Festas" />
            <div className="flex flex-1 flex-col gap-8 p-4 sm:p-6">
                <ManagementPageHeader
                    eyebrow="Pedidos"
                    title="Festas"
                    description="Acompanha todos os pedidos de marcação recebidos."
                />
                <ManagementSection
                    title="Pedidos de marcação"
                    description={`${partyBookings.total} pedido${partyBookings.total === 1 ? '' : 's'} guardado${partyBookings.total === 1 ? '' : 's'}.`}
                >
                    {partyBookings.data.length === 0 ? (
                        <EmptyState message="Ainda não existem pedidos de festa." />
                    ) : (
                        <>
                            <BookingsTable bookings={partyBookings.data} />
                            <PaginationNav
                                pagination={partyBookings}
                                label="Paginação de festas"
                            />
                        </>
                    )}
                </ManagementSection>
            </div>
        </>
    );
}

function BookingsTable({ bookings }: { bookings: ManagedPartyBooking[] }) {
    return (
        <div className="-mx-4 overflow-x-auto sm:-mx-6">
            <table className="w-full min-w-[72rem] text-left text-sm">
                <thead className="border-b text-xs tracking-wide text-muted-foreground uppercase">
                    <tr>
                        <th className="px-4 py-3 font-semibold sm:pl-6">
                            Pedido em
                        </th>
                        <th className="px-4 py-3 font-semibold">Festa</th>
                        <th className="px-4 py-3 font-semibold">
                            Data pretendida
                        </th>
                        <th className="px-4 py-3 font-semibold">Cliente</th>
                        <th className="px-4 py-3 text-right font-semibold">
                            Total
                        </th>
                        <th className="px-4 py-3 font-semibold">Estado</th>
                        <th className="px-4 py-3 pr-4 font-semibold sm:pr-6">
                            Pagamento
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {bookings.map((booking) => (
                        <tr
                            key={booking.id}
                            className="transition-colors hover:bg-muted/40"
                        >
                            <td className="px-4 py-4 text-muted-foreground sm:pl-6">
                                {formatRequestDate(booking.created_at)}
                            </td>
                            <td className="px-4 py-4">
                                <Link
                                    href={bookingShow(booking.id)}
                                    prefetch
                                    className="font-bold text-[#376b50] underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-[#558b6e] focus-visible:outline-none"
                                >
                                    {booking.reference}
                                </Link>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {booking.child.name} · {booking.park}
                                </p>
                            </td>
                            <td className="px-4 py-4">
                                <p className="font-medium">
                                    {formatIntendedPartyDate(
                                        booking.party_date,
                                    )}
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {booking.party_time.slice(0, 5)}
                                </p>
                            </td>
                            <td className="px-4 py-4">
                                <p className="font-medium">
                                    {booking.customer.name}
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {booking.customer.email}
                                </p>
                            </td>
                            <td className="px-4 py-4 text-right font-semibold">
                                {formatTotal(booking.total_cents)}
                            </td>
                            <td className="px-4 py-4">
                                <StatusBadge status={booking.status} />
                            </td>
                            <td className="px-4 py-4 pr-4 sm:pr-6">
                                {booking.payment_status ? (
                                    <StatusBadge
                                        status={booking.payment_status}
                                    />
                                ) : (
                                    <span className="text-muted-foreground">
                                        Por definir
                                    </span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function formatRequestDate(value: string | null): string {
    if (!value) {
        return '—';
    }

    return new Intl.DateTimeFormat('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value));
}

function formatIntendedPartyDate(value: string): string {
    return new Intl.DateTimeFormat('pt-PT', {
        day: '2-digit',
        month: '2-digit',
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

ManagementBookings.layout = {
    breadcrumbs: [
        {
            title: 'Festas',
            href: bookingsIndex(),
        },
    ],
};
