import { Head, Link } from '@inertiajs/react';
import {
    CalendarCheckIcon,
    MailCheckIcon,
    PartyPopperIcon,
    UsersRoundIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { index as managementIndex } from '@/routes/management';

type Status = {
    value: string;
    label: string;
};

type ManagedUser = {
    id: number;
    name: string;
    email: string;
    role: Status;
    marketing: Status;
    party_bookings_count: number;
    created_at: string | null;
};

type PartyBooking = {
    id: number;
    status: Status;
    customer: {
        name: string;
        email: string;
    };
    park: string;
    child: {
        name: string;
        age: number;
    };
    party_date: string;
    party_time: string;
    guests: number;
    program: string;
    created_at: string | null;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Pagination<T> = {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
};

type ManagementPageProps = {
    stats: {
        users: number;
        marketing: number;
        pending_bookings: number;
    };
    users: Pagination<ManagedUser>;
    party_bookings: Pagination<PartyBooking>;
};

export default function ManagementIndex({
    stats,
    users,
    party_bookings: partyBookings,
}: ManagementPageProps) {
    return (
        <>
            <Head title="Gestão" />

            <div className="flex flex-1 flex-col gap-8 p-4 sm:p-6">
                <header className="space-y-2">
                    <p className="text-sm font-semibold tracking-wide text-[#558b6e] uppercase">
                        Área interna
                    </p>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Clientes e pedidos de festa
                    </h1>
                    <p className="max-w-3xl text-muted-foreground">
                        Consulta os contactos, o consentimento de marketing e os
                        pedidos de marcação recebidos.
                    </p>
                </header>

                <section
                    aria-label="Resumo"
                    className="grid gap-4 sm:grid-cols-3"
                >
                    <StatCard
                        label="Utilizadores"
                        value={stats.users}
                        icon={<UsersRoundIcon />}
                    />
                    <StatCard
                        label="Marketing aceite"
                        value={stats.marketing}
                        icon={<MailCheckIcon />}
                    />
                    <StatCard
                        label="Pedidos pendentes"
                        value={stats.pending_bookings}
                        icon={<CalendarCheckIcon />}
                    />
                </section>

                <ManagementSection
                    title="Utilizadores"
                    description={`${users.total} utilizador${users.total === 1 ? '' : 'es'} registado${users.total === 1 ? '' : 's'}.`}
                >
                    {users.data.length === 0 ? (
                        <EmptyState message="Ainda não existem utilizadores registados." />
                    ) : (
                        <>
                            <div className="grid gap-3 md:hidden">
                                {users.data.map((user) => (
                                    <UserCard key={user.id} user={user} />
                                ))}
                            </div>
                            <UsersTable users={users.data} />
                            <PaginationNav
                                pagination={users}
                                label="Paginação de utilizadores"
                            />
                        </>
                    )}
                </ManagementSection>

                <ManagementSection
                    title="Pedidos de marcação"
                    description={`${partyBookings.total} pedido${partyBookings.total === 1 ? '' : 's'} guardado${partyBookings.total === 1 ? '' : 's'}.`}
                >
                    {partyBookings.data.length === 0 ? (
                        <EmptyState message="Ainda não existem pedidos guardados. O formulário público será ligado a esta lista na fase de submissão." />
                    ) : (
                        <>
                            <div className="grid gap-3 lg:hidden">
                                {partyBookings.data.map((booking) => (
                                    <PartyBookingCard
                                        key={booking.id}
                                        booking={booking}
                                    />
                                ))}
                            </div>
                            <PartyBookingsTable
                                partyBookings={partyBookings.data}
                            />
                            <PaginationNav
                                pagination={partyBookings}
                                label="Paginação de pedidos"
                            />
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

function ManagementSection({
    title,
    description,
    children,
}: {
    title: string;
    description: string;
    children: ReactNode;
}) {
    return (
        <section className="overflow-hidden rounded-xl border bg-card shadow-xs">
            <div className="border-b px-4 py-5 sm:px-6">
                <h2 className="text-xl font-bold">{title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    {description}
                </p>
            </div>
            <div className="p-4 sm:p-6">{children}</div>
        </section>
    );
}

function UserCard({ user }: { user: ManagedUser }) {
    return (
        <article className="grid gap-4 rounded-xl border p-4">
            <div>
                <p className="font-semibold">{user.name || 'Sem nome'}</p>
                <p className="text-sm break-all text-muted-foreground">
                    {user.email}
                </p>
            </div>
            <div className="flex flex-wrap gap-2">
                <StatusBadge status={user.role} />
                <StatusBadge status={user.marketing} />
            </div>
            <div className="flex justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Pedidos</span>
                <span className="font-semibold">
                    {user.party_bookings_count}
                </span>
            </div>
            <div className="flex justify-between gap-4 text-sm">
                <span className="text-muted-foreground">Registo</span>
                <span>{formatDate(user.created_at)}</span>
            </div>
        </article>
    );
}

function UsersTable({ users }: { users: ManagedUser[] }) {
    return (
        <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-3xl text-left text-sm">
                <thead className="border-b text-xs tracking-wide text-muted-foreground uppercase">
                    <tr>
                        <th className="px-3 py-3 font-semibold">Utilizador</th>
                        <th className="px-3 py-3 font-semibold">Função</th>
                        <th className="px-3 py-3 font-semibold">Marketing</th>
                        <th className="px-3 py-3 text-center font-semibold">
                            Pedidos
                        </th>
                        <th className="px-3 py-3 text-right font-semibold">
                            Registo
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td className="px-3 py-4">
                                <p className="font-semibold">
                                    {user.name || 'Sem nome'}
                                </p>
                                <p className="text-muted-foreground">
                                    {user.email}
                                </p>
                            </td>
                            <td className="px-3 py-4">
                                <StatusBadge status={user.role} />
                            </td>
                            <td className="px-3 py-4">
                                <StatusBadge status={user.marketing} />
                            </td>
                            <td className="px-3 py-4 text-center font-semibold">
                                {user.party_bookings_count}
                            </td>
                            <td className="px-3 py-4 text-right">
                                {formatDate(user.created_at)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function PartyBookingCard({ booking }: { booking: PartyBooking }) {
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
                <BookingDetail
                    label="Cliente"
                    value={booking.customer.name || booking.customer.email}
                />
                <BookingDetail label="Parque" value={booking.park} />
                <BookingDetail label="Programa" value={booking.program} />
                <BookingDetail
                    label="Convidados"
                    value={booking.guests.toString()}
                />
            </dl>
        </article>
    );
}

function PartyBookingsTable({
    partyBookings,
}: {
    partyBookings: PartyBooking[];
}) {
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
                    {partyBookings.map((booking) => (
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
                                    {booking.customer.name || 'Sem nome'}
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

function BookingDetail({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="text-right font-medium">{value}</dd>
        </div>
    );
}

function StatusBadge({ status }: { status: Status }) {
    return (
        <span
            className={cn(
                'inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold',
                status.value === 'accepted' ||
                    status.value === 'confirmed' ||
                    status.value === 'admin'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                    : status.value === 'pending'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                      : status.value === 'staff' || status.value === 'contacted'
                        ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200'
                        : 'bg-muted text-muted-foreground',
            )}
        >
            {status.label}
        </span>
    );
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="grid justify-items-center gap-3 rounded-xl border border-dashed p-8 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <PartyPopperIcon className="size-5" />
            </span>
            <p className="max-w-xl text-sm text-muted-foreground">{message}</p>
        </div>
    );
}

function PaginationNav<T>({
    pagination,
    label,
}: {
    pagination: Pagination<T>;
    label: string;
}) {
    if (pagination.last_page <= 1) {
        return null;
    }

    return (
        <nav
            aria-label={label}
            className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-5"
        >
            <p className="text-sm text-muted-foreground">
                {pagination.from}–{pagination.to} de {pagination.total}
            </p>
            <div className="flex flex-wrap gap-1">
                {pagination.links.map((link) => {
                    const labelText = paginationLabel(link.label);

                    if (!link.url) {
                        return (
                            <span
                                key={link.label}
                                aria-disabled="true"
                                className="inline-flex min-w-9 items-center justify-center rounded-md border px-3 py-2 text-sm text-muted-foreground opacity-50"
                            >
                                {labelText}
                            </span>
                        );
                    }

                    return (
                        <Link
                            key={link.label}
                            href={link.url}
                            preserveScroll
                            className={cn(
                                'inline-flex min-w-9 items-center justify-center rounded-md border px-3 py-2 text-sm font-medium transition hover:bg-muted focus-visible:ring-2 focus-visible:ring-[#558b6e] focus-visible:outline-none',
                                link.active &&
                                    'border-[#558b6e] bg-[#558b6e] text-white hover:bg-[#47775d]',
                            )}
                        >
                            {labelText}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

function paginationLabel(label: string): string {
    if (label.includes('Previous')) {
        return 'Anterior';
    }

    if (label.includes('Next')) {
        return 'Seguinte';
    }

    return label;
}

function formatDate(value: string | null): string {
    if (!value) {
        return '—';
    }

    return new Intl.DateTimeFormat('pt-PT').format(new Date(value));
}

function formatPartyDate(value: string): string {
    return new Intl.DateTimeFormat('pt-PT').format(
        new Date(`${value}T00:00:00`),
    );
}

ManagementIndex.layout = {
    breadcrumbs: [
        {
            title: 'Gestão',
            href: managementIndex(),
        },
    ],
};
