import { Head, Link, usePage } from '@inertiajs/react';
import { CalendarDaysIcon, PartyPopperIcon } from 'lucide-react';
import { CustomerBookingCard } from '@/components/customer-account/customer-booking-card';
import { Button } from '@/components/ui/button';
import account from '@/routes/account';
import { create as createPartyBooking } from '@/routes/party-bookings';
import type { CustomerBooking } from '@/types/customer-account';

type CustomerAccountProps = {
    openBookings: CustomerBooking[];
    recentBookings: CustomerBooking[];
};

export default function CustomerAccount({
    openBookings,
    recentBookings,
}: CustomerAccountProps) {
    const user = usePage().props.auth.user;
    const firstName =
        user.name && user.name !== user.email
            ? user.name.trim().split(/\s+/)[0]
            : null;

    return (
        <>
            <Head title="A tua conta" />

            <header>
                <p className="text-sm font-bold tracking-wide text-[#558b6e] uppercase">
                    Área de cliente
                </p>
                <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                    {firstName ? `Olá, ${firstName}` : 'Olá!'}
                </h1>
                <p className="mt-2 max-w-2xl text-gray-600">
                    Acompanha os teus pedidos e vê o que acontece a seguir.
                </p>
            </header>

            <section className="mt-8" aria-labelledby="open-bookings-heading">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold text-gray-500">
                            Em acompanhamento
                        </p>
                        <h2
                            id="open-bookings-heading"
                            className="text-xl font-black"
                        >
                            Festas em aberto
                        </h2>
                    </div>
                    <Button
                        variant="link"
                        className="h-auto p-0 text-[#376b50]"
                        asChild
                    >
                        <Link href={account.bookings.index()}>Ver todas</Link>
                    </Button>
                </div>

                {openBookings.length > 0 ? (
                    <div className="mt-4 grid gap-4 xl:grid-cols-2">
                        {openBookings.map((booking) => (
                            <CustomerBookingCard
                                key={booking.id}
                                booking={booking}
                                showNextStep
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyBookings />
                )}
            </section>

            <section
                className="mt-10"
                aria-labelledby="recent-bookings-heading"
            >
                <h2 id="recent-bookings-heading" className="text-xl font-black">
                    Pedidos recentes
                </h2>

                {recentBookings.length > 0 ? (
                    <div className="mt-4 space-y-3">
                        {recentBookings.map((booking) => (
                            <CustomerBookingCard
                                key={booking.id}
                                booking={booking}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="mt-3 text-sm text-gray-600">
                        Ainda não existem pedidos no teu histórico.
                    </p>
                )}
            </section>
        </>
    );
}

function EmptyBookings() {
    return (
        <div className="mt-4 rounded-3xl border border-dashed border-[#558b6e]/40 bg-white/70 p-6 sm:p-8">
            <div className="flex size-11 items-center justify-center rounded-full bg-[#558b6e]/10 text-[#376b50]">
                <CalendarDaysIcon aria-hidden="true" />
            </div>
            <h3 className="mt-4 text-lg font-black">
                Não tens festas em aberto
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600">
                Quando fizeres um pedido, poderás acompanhar aqui o estado e os
                próximos passos.
            </p>
            <Button
                className="mt-5 rounded-xl bg-[#558b6e] text-white hover:bg-[#376b50]"
                asChild
            >
                <Link href={createPartyBooking()}>
                    <PartyPopperIcon aria-hidden="true" />
                    Marcar uma festa
                </Link>
            </Button>
        </div>
    );
}
