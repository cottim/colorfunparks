import { Head, Link } from '@inertiajs/react';
import { CheckCircle2Icon, LogInIcon } from 'lucide-react';
import AnimatedColorFunParksLogo from '@/components/animated-color-fun-parks-logo';
import { PublicFooter } from '@/components/public-footer';
import { Button } from '@/components/ui/button';
import { home, login } from '@/routes';

export default function PartyBookingReceived() {
    return (
        <>
            <Head title="Pedido recebido" />

            <div className="flex min-h-svh flex-col bg-linear-to-b from-[#FFFE00] to-[#FFCD00] text-gray-900">
                <header className="border-b border-black/10">
                    <div className="mx-auto w-full max-w-5xl px-4 py-3 sm:px-6 lg:px-8">
                        <Link href={home()} aria-label="Color Fun Parks">
                            <AnimatedColorFunParksLogo className="w-full max-w-3xs overflow-visible" />
                        </Link>
                    </div>
                </header>

                <main className="mx-auto flex w-full max-w-3xl flex-1 items-center px-4 py-12 sm:px-6 lg:px-8">
                    <section className="w-full rounded-3xl border border-black/10 bg-white/90 p-7 text-center shadow-xl backdrop-blur-sm sm:p-10">
                        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#558b6e]/12 text-[#376b50]">
                            <CheckCircle2Icon
                                className="size-7"
                                aria-hidden="true"
                            />
                        </div>
                        <h1 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl">
                            Recebemos o teu pedido
                        </h1>
                        <p className="mx-auto mt-3 max-w-xl leading-7 text-gray-600">
                            A nossa equipa vai verificar a disponibilidade e
                            entrar em contacto através dos dados que indicaste.
                        </p>
                        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-600">
                            Se preencheste um email, entra na tua conta com esse
                            mesmo endereço. Depois de o validares, este pedido
                            aparecerá automaticamente na área de cliente.
                        </p>

                        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                            <Button
                                className="rounded-xl bg-[#558b6e] text-white hover:bg-[#376b50]"
                                asChild
                            >
                                <Link href={login()}>
                                    <LogInIcon aria-hidden="true" />
                                    Entrar na conta
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                className="rounded-xl bg-white"
                                asChild
                            >
                                <Link href={home()}>Voltar ao site</Link>
                            </Button>
                        </div>
                    </section>
                </main>

                <PublicFooter />
            </div>
        </>
    );
}
