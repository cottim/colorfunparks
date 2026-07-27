import { Head } from '@inertiajs/react';
import {
    EmptyState,
    formatPartyDate,
    ManagementPageHeader,
    ManagementSection,
    PaginationNav,
    StatusBadge,
} from '@/components/management/management-ui';
import { index as bookingsIndex } from '@/routes/management/bookings';
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
                            <div className="grid gap-3 lg:hidden">
                                {partyBookings.data.map((booking) => (
                                    <BookingCard
                                        key={booking.id}
                                        booking={booking}
                                    />
                                ))}
                            </div>
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

function BookingCard({ booking }: { booking: ManagedPartyBooking }) {
    return (
        <article className="grid gap-4 rounded-xl border p-4">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="font-semibold">
                        {booking.child.name}, {booking.child.age} anos
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {formatPartyDate(booking.party_date)} às{' '}
                        {booking.party_time}
                    </p>
                </div>
                <StatusBadge status={booking.status} />
            </div>
            <dl className="grid gap-2 text-sm">
                <Detail label="Cliente" value={booking.customer.name} />
                <Detail label="Parque" value={booking.park} />
                <Detail label="Programa" value={booking.program} />
                <Detail label="Convidados" value={booking.guests.toString()} />
            </dl>
        </article>
    );
}

function BookingsTable({ bookings }: { bookings: ManagedPartyBooking[] }) {
    return (
        <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-5xl text-left text-sm">
                <thead className="border-b text-xs tracking-wide text-muted-foreground uppercase">
                    <tr>
                        <th className="px-3 py-3 font-semibold">Festa</th>
                        <th className="px-3 py-3 font-semibold">Cliente</th>
                        <th className="px-3 py-3 font-semibold">Parque</th>
                        <th className="px-3 py-3 font-semibold">Programa</th>
                        <th className="px-3 py-3 text-center font-semibold">
                            Convidados
                        </th>
                        <th className="px-3 py-3 text-right font-semibold">
                            Estado
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {bookings.map((booking) => (
                        <tr key={booking.id}>
                            <td className="px-3 py-4">
                                <p className="font-semibold">
                                    {booking.child.name}, {booking.child.age}{' '}
                                    anos
                                </p>
                                <p className="text-muted-foreground">
                                    {formatPartyDate(booking.party_date)} ·{' '}
                                    {booking.party_time}
                                </p>
                            </td>
                            <td className="px-3 py-4">
                                <p className="font-medium">
                                    {booking.customer.name}
                                </p>
                                <p className="text-muted-foreground">
                                    {booking.customer.email}
                                </p>
                            </td>
                            <td className="px-3 py-4">{booking.park}</td>
                            <td className="px-3 py-4">{booking.program}</td>
                            <td className="px-3 py-4 text-center font-semibold">
                                {booking.guests}
                            </td>
                            <td className="px-3 py-4 text-right">
                                <StatusBadge status={booking.status} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function Detail({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="text-right font-medium">{value}</dd>
        </div>
    );
}

ManagementBookings.layout = {
    breadcrumbs: [
        {
            title: 'Festas',
            href: bookingsIndex(),
        },
    ],
};
