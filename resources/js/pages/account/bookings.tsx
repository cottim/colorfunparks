import { Head, Link } from '@inertiajs/react';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    PartyPopperIcon,
} from 'lucide-react';
import { CustomerBookingCard } from '@/components/customer-account/customer-booking-card';
import { Button } from '@/components/ui/button';
import { create as createPartyBooking } from '@/routes/party-bookings';
import type { PaginatedCustomerBookings } from '@/types/customer-account';

export default function CustomerBookings({
    bookings,
}: {
    bookings: PaginatedCustomerBookings;
}) {
    return (
        <>
            <Head title="As minhas festas" />

            <header className="flex flex-wrap items-end justify-between gap-5">
                <div>
                    <p className="text-sm font-bold tracking-wide text-[#558b6e] uppercase">
                        Área de cliente
                    </p>
                    <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                        As minhas festas
                    </h1>
                    <p className="mt-2 max-w-2xl text-gray-600">
                        Consulta o histórico e abre um pedido para rever todos
                        os detalhes.
                    </p>
                </div>

                <Button
                    className="rounded-xl bg-[#558b6e] text-white hover:bg-[#376b50]"
                    asChild
                >
                    <Link href={createPartyBooking()}>
                        <PartyPopperIcon aria-hidden="true" />
                        Marcar uma festa
                    </Link>
                </Button>
            </header>

            {bookings.data.length > 0 ? (
                <>
                    <div className="mt-8 grid gap-4 xl:grid-cols-2">
                        {bookings.data.map((booking) => (
                            <CustomerBookingCard
                                key={booking.id}
                                booking={booking}
                            />
                        ))}
                    </div>
                    <CustomerBookingsPagination bookings={bookings} />
                </>
            ) : (
                <div className="mt-8 rounded-3xl border border-dashed border-[#558b6e]/40 bg-white/70 p-8 text-center">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#558b6e]/10 text-[#376b50]">
                        <PartyPopperIcon aria-hidden="true" />
                    </div>
                    <h2 className="mt-4 text-xl font-black">
                        Ainda não tens pedidos
                    </h2>
                    <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-600">
                        Quando marcares uma festa, o pedido e as respetivas
                        atualizações ficam disponíveis aqui.
                    </p>
                </div>
            )}
        </>
    );
}

function CustomerBookingsPagination({
    bookings,
}: {
    bookings: PaginatedCustomerBookings;
}) {
    if (bookings.last_page <= 1) {
        return null;
    }

    const previousLink = bookings.links[0];
    const nextLink = bookings.links[bookings.links.length - 1];

    return (
        <nav
            aria-label="Paginação das festas"
            className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-black/10 pt-5"
        >
            <p className="text-sm text-gray-600">
                {bookings.from}–{bookings.to} de {bookings.total} pedidos
            </p>
            <div className="flex gap-2">
                <PaginationLink
                    href={previousLink?.url ?? null}
                    label="Anterior"
                    icon={ChevronLeftIcon}
                />
                <PaginationLink
                    href={nextLink?.url ?? null}
                    label="Seguinte"
                    icon={ChevronRightIcon}
                    iconAfter
                />
            </div>
        </nav>
    );
}

function PaginationLink({
    href,
    label,
    icon: Icon,
    iconAfter = false,
}: {
    href: string | null;
    label: string;
    icon: typeof ChevronLeftIcon;
    iconAfter?: boolean;
}) {
    if (!href) {
        return (
            <span
                aria-disabled="true"
                className="inline-flex items-center gap-1 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-gray-400 opacity-60"
            >
                {!iconAfter && <Icon className="size-4" aria-hidden="true" />}
                {label}
                {iconAfter && <Icon className="size-4" aria-hidden="true" />}
            </span>
        );
    }

    return (
        <Link
            href={href}
            preserveScroll
            className="inline-flex items-center gap-1 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold transition hover:border-[#558b6e]/40 hover:bg-[#558b6e]/5 focus-visible:ring-2 focus-visible:ring-[#376b50] focus-visible:outline-none"
        >
            {!iconAfter && <Icon className="size-4" aria-hidden="true" />}
            {label}
            {iconAfter && <Icon className="size-4" aria-hidden="true" />}
        </Link>
    );
}
