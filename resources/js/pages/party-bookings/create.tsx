import { Head, Link } from '@inertiajs/react';
import { ArrowLeftIcon } from 'lucide-react';
import AnimatedColorFunParksLogo from '@/components/animated-color-fun-parks-logo';
import { BookParty } from '@/components/book-party/book-party';
import { PublicFooter } from '@/components/public-footer';
import { Separator } from '@/components/ui/separator';
import { home } from '@/routes';

export default function CreatePartyBooking() {
    return (
        <>
            <Head title="Marcar festa" />

            <div className="flex min-h-svh flex-col bg-linear-to-b from-[#FFFE00] to-[#FFCD00] text-gray-900">
                <header className="border-b border-black/10">
                    <nav
                        aria-label="Navegação principal"
                        className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8"
                    >
                        <Link href={home()} aria-label="Color Fun Parks">
                            <AnimatedColorFunParksLogo className="w-full max-w-3xs overflow-visible" />
                        </Link>

                        <Link
                            href={home()}
                            className="inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:outline-none"
                        >
                            <ArrowLeftIcon className="size-4" />
                            <span className="hidden sm:inline">
                                Voltar ao site
                            </span>
                            <span className="sm:hidden">Voltar</span>
                        </Link>
                    </nav>
                </header>

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

                        <BookParty />
                    </div>
                </main>

                <PublicFooter />
            </div>
        </>
    );
}
