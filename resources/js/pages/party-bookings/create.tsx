import { Head, Link } from '@inertiajs/react';
import { ArrowLeftIcon } from 'lucide-react';
import { BookParty } from '@/components/book-party/book-party';
import type {
    BookingOptions,
    AuthenticatedCustomer,
    PartyProgramSelection,
} from '@/components/book-party/types';
import { PublicFooter } from '@/components/public-footer';
import { PublicHeader } from '@/components/public-header';
import { Separator } from '@/components/ui/separator';
import { home } from '@/routes';

export default function CreatePartyBooking({
    bookingOptions,
    initialProgramSelection,
    authenticatedCustomer,
}: {
    bookingOptions: BookingOptions;
    initialProgramSelection: PartyProgramSelection | null;
    authenticatedCustomer: AuthenticatedCustomer | null;
}) {
    return (
        <>
            <Head title="Marcar festa" />

            <div className="flex min-h-svh flex-col bg-linear-to-b from-[#FFFE00] to-[#FFCD00] text-gray-900">
                <PublicHeader>
                    <Link
                        href={home()}
                        className="inline-flex size-10 shrink-0 items-center justify-center gap-2 rounded-full px-2 text-sm font-semibold hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:outline-none sm:w-auto sm:px-3"
                    >
                        <ArrowLeftIcon className="size-4" aria-hidden="true" />
                        <span className="hidden sm:inline">Voltar ao site</span>
                        <span className="sr-only sm:hidden">
                            Voltar ao site
                        </span>
                    </Link>
                </PublicHeader>

                <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                    <div className="rounded-2xl border border-black/10 bg-white/80 p-5 shadow-xl backdrop-blur-sm sm:p-8">
                        <div className="flex flex-col gap-3">
                            <p className="text-sm font-semibold tracking-wide text-[#35634b] uppercase">
                                Pedido de marcação
                            </p>
                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                Vamos preparar a festa
                            </h1>
                            <p className="max-w-2xl text-gray-700">
                                Preenche os dados pela ordem apresentada. A
                                nossa equipa confirmará posteriormente a
                                disponibilidade e todos os detalhes.
                            </p>
                        </div>

                        <Separator className="my-6 bg-black/10 sm:my-8" />

                        <BookParty
                            bookingOptions={bookingOptions}
                            initialProgramSelection={initialProgramSelection}
                            authenticatedCustomer={authenticatedCustomer}
                        />
                    </div>
                </main>

                <PublicFooter />
            </div>
        </>
    );
}
