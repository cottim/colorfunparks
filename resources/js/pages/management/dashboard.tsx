import { Head, Link } from '@inertiajs/react';
import {
    CalendarCheckIcon,
    CalendarClockIcon,
    MailCheckIcon,
    UsersRoundIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import {
    EmptyState,
    formatPartyDate,
    ManagementPageHeader,
    ManagementSection,
    StatusBadge,
} from '@/components/management/management-ui';
import { index as managementIndex } from '@/routes/management';
import {
    index as bookingsIndex,
    show as bookingShow,
} from '@/routes/management/bookings';
import type { Status } from '@/types/management';

type RecentBooking = {
    id: number;
    reference: string;
    customer_name: string;
    child_name: string;
    party_date: string;
    party_time: string;
    status: Status;
};

type Props = {
    stats: {
        pending_bookings: number;
        upcoming_bookings: number;
        customers: number;
        marketing: number;
    };
    recent_bookings: RecentBooking[];
};

export default function ManagementDashboard({
    stats,
    recent_bookings: recentBookings,
}: Props) {
    return (
        <>
            <Head title="Dashboard" />

            <div className="flex flex-1 flex-col gap-8 p-4 sm:p-6">
                <ManagementPageHeader
                    eyebrow="Área interna"
                    title="Dashboard"
                    description="Uma visão rápida dos pedidos de festa e dos clientes da Color Fun Parks."
                />

                <section
                    aria-label="Resumo"
                    className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
                >
                    <StatCard
                        label="Pedidos pendentes"
                        value={stats.pending_bookings}
                        icon={<CalendarClockIcon />}
                    />
                    <StatCard
                        label="Festas futuras"
                        value={stats.upcoming_bookings}
                        icon={<CalendarCheckIcon />}
                    />
                    <StatCard
                        label="Clientes"
                        value={stats.customers}
                        icon={<UsersRoundIcon />}
                    />
                    <StatCard
                        label="Marketing aceite"
                        value={stats.marketing}
                        icon={<MailCheckIcon />}
                    />
                </section>

                <ManagementSection
                    title="Pedidos recentes"
                    description="Os cinco pedidos de marcação recebidos mais recentemente."
                >
                    {recentBookings.length === 0 ? (
                        <EmptyState message="Ainda não existem pedidos de festa." />
                    ) : (
                        <>
                            <div className="-mx-4 overflow-x-auto sm:-mx-6">
                                <table className="w-full min-w-3xl text-left text-sm">
                                    <thead className="border-b text-xs tracking-wide text-muted-foreground uppercase">
                                        <tr>
                                            <th className="px-4 py-3 font-semibold sm:pl-6">
                                                Festa
                                            </th>
                                            <th className="px-4 py-3 font-semibold">
                                                Data pretendida
                                            </th>
                                            <th className="px-4 py-3 font-semibold">
                                                Cliente
                                            </th>
                                            <th className="px-4 py-3 pr-4 font-semibold sm:pr-6">
                                                Estado
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {recentBookings.map((booking) => (
                                            <tr
                                                key={booking.id}
                                                className="transition-colors hover:bg-muted/40"
                                            >
                                                <td className="px-4 py-4 sm:pl-6">
                                                    <Link
                                                        href={bookingShow(
                                                            booking.id,
                                                        )}
                                                        prefetch
                                                        className="font-bold text-[#376b50] underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-[#558b6e] focus-visible:outline-none"
                                                    >
                                                        {booking.reference}
                                                    </Link>
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {booking.child_name}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <p className="font-medium">
                                                        {formatPartyDate(
                                                            booking.party_date,
                                                        )}
                                                    </p>
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {booking.party_time.slice(
                                                            0,
                                                            5,
                                                        )}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-4 font-medium">
                                                    {booking.customer_name}
                                                </td>
                                                <td className="px-4 py-4 pr-4 sm:pr-6">
                                                    <StatusBadge
                                                        status={booking.status}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <Link
                                href={bookingsIndex()}
                                className="mt-5 inline-block text-sm font-semibold text-[#558b6e] hover:underline"
                            >
                                Ver todas as festas
                            </Link>
                        </>
                    )}
                </ManagementSection>
            </div>
        </>
    );
}

function StatCard({
    label,
    value,
    icon,
}: {
    label: string;
    value: number;
    icon: ReactNode;
}) {
    return (
        <article className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-xs">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#558b6e]/15 text-[#558b6e] [&>svg]:size-5">
                {icon}
            </span>
            <div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
            </div>
        </article>
    );
}

ManagementDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: managementIndex(),
        },
    ],
};
