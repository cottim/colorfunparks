import { Link } from '@inertiajs/react';
import {
    ArrowLeftIcon,
    CalendarDaysIcon,
    MessagesSquareIcon,
    SparklesIcon,
} from 'lucide-react';
import AnimatedColorFunParksLogo from '@/components/animated-color-fun-parks-logo';
import { PublicFooter } from '@/components/public-footer';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

const accountBenefits = [
    {
        icon: CalendarDaysIcon,
        text: 'Acompanha os teus pedidos de festa',
    },
    {
        icon: MessagesSquareIcon,
        text: 'Mantém toda a comunicação num só lugar',
    },
];

export default function CustomerLoginLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col overflow-hidden bg-linear-to-br from-[#FFFE00] via-[#FFE86B] to-[#FFCD00] text-gray-900">
            <header className="border-b border-black/10">
                <nav className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
                    <Link href={home()} className="min-w-0">
                        <AnimatedColorFunParksLogo className="w-full max-w-52 overflow-visible sm:max-w-3xs" />
                    </Link>

                    <Link
                        href={home()}
                        className="inline-flex shrink-0 items-center gap-2 rounded-full border border-black/15 bg-white/55 px-3 py-2 text-sm font-semibold transition-colors hover:bg-white/80 focus-visible:ring-2 focus-visible:ring-[#376b50] focus-visible:ring-offset-2 focus-visible:outline-none"
                    >
                        <ArrowLeftIcon className="size-4" aria-hidden="true" />
                        <span className="hidden sm:inline">Voltar ao site</span>
                        <span className="sm:hidden">Voltar</span>
                    </Link>
                </nav>
            </header>

            <main className="relative flex flex-1 items-center py-8 sm:py-12 lg:py-16">
                <div
                    className="absolute -top-24 -left-24 size-72 rounded-full bg-[#27A6DF]/15 blur-2xl"
                    aria-hidden="true"
                />
                <div
                    className="absolute right-0 bottom-0 size-80 translate-x-1/3 translate-y-1/3 rounded-full bg-[#3EB54B]/20 blur-2xl"
                    aria-hidden="true"
                />

                <div className="relative mx-auto grid w-full max-w-5xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_26rem] lg:gap-14 lg:px-8">
                    <section
                        aria-labelledby="customer-login-title"
                        className="rounded-3xl border border-black/10 bg-white p-5 shadow-[0_24px_70px_-30px_rgba(31,41,55,0.45)] sm:p-8 lg:order-2"
                    >
                        <div className="mb-7 space-y-2">
                            <h1
                                id="customer-login-title"
                                className="text-2xl font-bold tracking-tight text-gray-900"
                            >
                                {title}
                            </h1>
                            <p className="text-sm leading-6 text-gray-600">
                                {description}
                            </p>
                        </div>

                        {children}
                    </section>

                    <section className="space-y-6 lg:order-1 lg:pr-4">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/65 px-3 py-1.5 text-sm font-semibold text-[#376b50] ring-1 ring-black/10">
                            <SparklesIcon
                                className="size-4"
                                aria-hidden="true"
                            />
                            A tua área Color Fun
                        </div>

                        <div className="max-w-xl space-y-3">
                            <h2 className="text-3xl leading-tight font-black tracking-tight text-balance sm:text-4xl lg:text-5xl">
                                Menos emails perdidos. Mais tempo para a
                                diversão.
                            </h2>
                            <p className="max-w-lg text-base leading-7 text-gray-700 sm:text-lg">
                                Consulta o estado dos teus pedidos e encontra a
                                informação da festa sem teres de procurar em
                                várias mensagens.
                            </p>
                        </div>

                        <ul className="hidden space-y-3 sm:block">
                            {accountBenefits.map(({ icon: Icon, text }) => (
                                <li
                                    key={text}
                                    className="flex items-center gap-3 font-medium text-gray-800"
                                >
                                    <span className="flex size-9 items-center justify-center rounded-full bg-white/70 text-[#376b50] ring-1 ring-black/10">
                                        <Icon
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                    </span>
                                    {text}
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
            </main>

            <PublicFooter className="mt-auto bg-white/30" />
        </div>
    );
}
