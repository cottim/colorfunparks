import { Head, Link } from '@inertiajs/react';
import { ArrowLeftIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { PublicFooter } from '@/components/public-footer';
import { PublicHeader } from '@/components/public-header';
import { home } from '@/routes';

type LegalPageLayoutProps = {
    title: string;
    description: string;
    children: ReactNode;
};

export function LegalPageLayout({
    title,
    description,
    children,
}: LegalPageLayoutProps) {
    return (
        <>
            <Head title={title} />

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

                <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                    <article className="rounded-2xl border border-black/10 bg-white/90 p-5 shadow-xl backdrop-blur-sm sm:p-8 lg:p-10">
                        <header className="border-b border-black/10 pb-6 sm:pb-8">
                            <p className="text-sm font-semibold tracking-wide text-red-600 uppercase">
                                Informação legal
                            </p>
                            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                                {title}
                            </h1>
                            <p className="mt-4 max-w-2xl text-gray-700">
                                {description}
                            </p>
                            <p className="mt-3 text-sm text-gray-600">
                                Última atualização: 23 de julho de 2026
                            </p>
                        </header>

                        <div className="mt-8 space-y-9 text-gray-700 [&_a]:font-medium [&_a]:text-gray-900 [&_a]:underline [&_a]:underline-offset-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-gray-900 [&_li]:pl-1 [&_p]:leading-7 [&_section]:space-y-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
                            {children}
                        </div>
                    </article>
                </main>

                <PublicFooter />
            </div>
        </>
    );
}
