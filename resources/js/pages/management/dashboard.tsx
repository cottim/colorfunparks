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
import { index as bookingsIndex } from '@/routes/management/bookings';
import type { Status } from '@/types/management';

type RecentBooking = {
    id: number;
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
                        <div className="grid gap-3">
                            {recentBookings.map((booking) => (
                                <article
                                    key={booking.id}
                                    className="flex flex-col justify-between gap-3 rounded-xl border p-4 sm:flex-row sm:items-center"
                                >
                                    <div>
                                        <p className="font-semibold">
                                            {booking.child_name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {booking.customer_name} ·{' '}
                                            {formatPartyDate(
                                                booking.party_date,
                                            )}{' '}
                                            às {booking.party_time}
                                        </p>
                                    </div>
                                    <StatusBadge status={booking.status} />
                                </article>
                            ))}
                            <Link
                                href={bookingsIndex()}
                                className="mt-2 w-fit text-sm font-semibold text-[#558b6e] hover:underline"
                            >
                                Ver todas as festas
                            </Link>
                        </div>
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
