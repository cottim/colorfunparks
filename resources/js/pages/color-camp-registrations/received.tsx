import { Head, Link, usePage } from '@inertiajs/react';
import { CheckCircle2Icon, LogInIcon } from 'lucide-react';
import { PublicFooter } from '@/components/public-footer';
import { PublicHeader } from '@/components/public-header';
import { Button } from '@/components/ui/button';
import { home, login } from '@/routes';

export default function ColorCampRegistrationReceived() {
    const user = usePage().props.auth.user;

    return (
        <>
            <Head title="Inscrição Color Camp recebida" />
            <div className="flex min-h-svh flex-col bg-linear-to-b from-[#fffef0] to-[#ffcd00]">
                <PublicHeader />
                <main className="grid flex-1 place-items-center px-4 py-12">
                    <section className="w-full max-w-xl rounded-3xl border border-black/10 bg-white/90 p-7 text-center shadow-xl sm:p-10">
                        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#558b6e]/12 text-[#376b50]">
                            <CheckCircle2Icon
                                className="size-8"
                                aria-hidden="true"
                            />
                        </span>
                        <h1 className="mt-5 text-3xl font-black">
                            Recebemos a inscrição
                        </h1>
                        <p className="mt-3 leading-7 text-gray-600">
                            A nossa equipa vai verificar a disponibilidade e
                            entrar em contacto. A inscrição ainda não representa
                            uma vaga confirmada.
                        </p>
                        {!user && (
                            <p className="mt-4 rounded-xl bg-[#558b6e]/8 p-3 text-sm text-gray-700">
                                Entra com o mesmo email para acompanhares esta
                                inscrição na tua área de cliente.
                            </p>
                        )}
                        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                            {!user && (
                                <Button
                                    asChild
                                    className="rounded-xl bg-[#558b6e] text-white hover:bg-[#376b50]"
                                >
                                    <Link href={login()}>
                                        <LogInIcon aria-hidden="true" />
                                        Entrar na conta
                                    </Link>
                                </Button>
                            )}
                            <Button
                                asChild
                                variant="outline"
                                className="rounded-xl"
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
