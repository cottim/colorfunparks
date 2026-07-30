import { Head, Link } from '@inertiajs/react';
import { CalendarDaysIcon, ChevronRightIcon, SunIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    index as registrationsIndex,
    show as registrationShow,
} from '@/routes/account/color-camp-registrations';
import { create as createRegistration } from '@/routes/color-camp-registrations';
import type {
    CustomerColorCampRegistrationSummary,
    PaginatedCustomerColorCampRegistrations,
} from '@/types/customer-account';

export default function CustomerColorCampRegistrations({
    registrations,
}: {
    registrations: PaginatedCustomerColorCampRegistrations;
}) {
    return (
        <>
            <Head title="Inscrições Color Camp" />
            <header className="flex flex-wrap items-end justify-between gap-5">
                <div>
                    <p className="text-sm font-bold tracking-wide text-[#558b6e] uppercase">
                        Área de cliente
                    </p>
                    <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                        Color Camp
                    </h1>
                    <p className="mt-2 max-w-2xl text-gray-600">
                        Acompanha as inscrições e consulta os períodos,
                        autorizações e estado de cada pedido.
                    </p>
                </div>
                <Button
                    asChild
                    className="rounded-xl bg-[#558b6e] text-white hover:bg-[#376b50]"
                >
                    <Link href={createRegistration()}>
                        <SunIcon aria-hidden="true" />
                        Nova inscrição
                    </Link>
                </Button>
            </header>

            {registrations.data.length > 0 ? (
                <div className="mt-8 space-y-3">
                    {registrations.data.map((registration) => (
                        <RegistrationCard
                            key={registration.id}
                            registration={registration}
                        />
                    ))}
                    {registrations.last_page > 1 && (
                        <nav
                            aria-label="Paginação das inscrições"
                            className="flex flex-wrap gap-2 border-t border-black/10 pt-5"
                        >
                            {registrations.links.map((link) =>
                                link.url ? (
                                    <Link
                                        key={link.label}
                                        href={link.url}
                                        preserveScroll
                                        className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold"
                                    >
                                        {paginationLabel(link.label)}
                                    </Link>
                                ) : null,
                            )}
                        </nav>
                    )}
                </div>
            ) : (
                <div className="mt-8 rounded-3xl border border-dashed border-[#558b6e]/40 bg-white/70 p-8 text-center">
                    <SunIcon
                        className="mx-auto size-10 text-[#376b50]"
                        aria-hidden="true"
                    />
                    <h2 className="mt-4 text-xl font-black">
                        Ainda não tens inscrições
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Quando te inscreveres no Color Camp, o pedido aparecerá
                        aqui.
                    </p>
                </div>
            )}
        </>
    );
}

function RegistrationCard({
    registration,
}: {
    registration: CustomerColorCampRegistrationSummary;
}) {
    return (
        <Link
            href={registrationShow(registration.id)}
            className="group flex items-center gap-4 rounded-2xl border border-black/10 bg-white/80 p-4 shadow-sm transition hover:border-[#558b6e]/40 hover:shadow-md focus-visible:ring-2 focus-visible:ring-[#376b50] focus-visible:outline-none sm:p-5"
        >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#ffcd00]/25 text-[#376b50]">
                <CalendarDaysIcon aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                    <strong>{registration.reference}</strong>
                    <StatusPill
                        status={registration.status}
                        label={registration.statusLabel}
                    />
                </span>
                <span className="mt-1 block text-sm text-gray-600">
                    {registration.childName} · {registration.attendanceLabel}
                </span>
                <span className="mt-1 block truncate text-xs text-gray-500">
                    {registration.selectedPeriods.join(' · ')}
                </span>
            </span>
            <ChevronRightIcon
                className="size-5 shrink-0 text-gray-400 transition group-hover:translate-x-0.5"
                aria-hidden="true"
            />
        </Link>
    );
}

export function StatusPill({
    status,
    label,
}: {
    status: CustomerColorCampRegistrationSummary['status'];
    label: string;
}) {
    return (
        <span
            className={
                status === 'confirmed'
                    ? 'rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800'
                    : status === 'cancelled'
                      ? 'rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-600'
                      : 'rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800'
            }
        >
            {label}
        </span>
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

CustomerColorCampRegistrations.layout = {
    breadcrumbs: [
        {
            title: 'Color Camp',
            href: registrationsIndex(),
        },
    ],
};
