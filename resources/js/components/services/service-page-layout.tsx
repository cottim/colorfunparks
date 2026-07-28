import { Head, Link } from '@inertiajs/react';
import { ArrowLeftIcon, CalendarDaysIcon, SparklesIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { PublicFooter } from '@/components/public-footer';
import { PublicHeader } from '@/components/public-header';
import { CtaButton } from '@/components/ui/cta-button';
import { home } from '@/routes';
import { create as createPartyBooking } from '@/routes/party-bookings';

type ServicePageLayoutProps = {
    title: string;
    description: string;
    eyebrow: string;
    heading: string;
    introduction: string;
    highlight?: string;
    heroAside?: ReactNode;
    children: ReactNode;
};

export function ServicePageLayout({
    title,
    description,
    eyebrow,
    heading,
    introduction,
    highlight,
    heroAside,
    children,
}: ServicePageLayoutProps) {
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta
                    head-key="description"
                    name="description"
                    content={description}
                />
            </Head>

            <div className="flex min-h-svh flex-col overflow-hidden bg-linear-to-b from-[#FFFE00] to-[#FFCD00] text-gray-900">
                <PublicHeader>
                    <CtaButton asChild attention="shine">
                        <Link href={createPartyBooking()}>
                            <CalendarDaysIcon />
                            <span className="hidden sm:inline">
                                Agendar Festa
                            </span>
                            <span className="sm:hidden">Festa</span>
                        </Link>
                    </CtaButton>
                </PublicHeader>

                <main className="flex-1">
                    <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                        <Link
                            href={home()}
                            className="inline-flex items-center gap-2 text-sm font-bold text-[#376b50] underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-[#376b50] focus-visible:outline-none"
                        >
                            <ArrowLeftIcon
                                className="size-4"
                                aria-hidden="true"
                            />
                            Voltar à página principal
                        </Link>

                        <div className="mt-6 grid overflow-hidden rounded-3xl border border-black/10 bg-white/85 shadow-2xl lg:grid-cols-[1.1fr_0.9fr]">
                            <div className="flex flex-col justify-center gap-5 p-6 sm:p-10 lg:p-12">
                                <div className="flex items-center gap-2 text-sm font-bold tracking-wide text-[#376b50] uppercase">
                                    <SparklesIcon
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                    {eyebrow}
                                </div>

                                <div className="space-y-4">
                                    {highlight && (
                                        <p className="text-lg font-black text-[#376b50]">
                                            {highlight}
                                        </p>
                                    )}
                                    <h1 className="text-4xl leading-tight font-black tracking-tight text-balance sm:text-5xl">
                                        {heading}
                                    </h1>
                                    <p className="max-w-xl text-base leading-7 text-gray-700 sm:text-lg">
                                        {introduction}
                                    </p>
                                </div>
                            </div>

                            {heroAside && (
                                <div className="min-h-72 bg-[#558b6e]">
                                    {heroAside}
                                </div>
                            )}
                        </div>
                    </section>

                    {children}
                </main>

                <PublicFooter className="mt-auto" />
            </div>
        </>
    );
}
