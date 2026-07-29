import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeftIcon,
    LayoutDashboardIcon,
    NewspaperIcon,
} from 'lucide-react';
import { ArticleCard } from '@/components/articles/article-card';
import { PublicFooter } from '@/components/public-footer';
import { PublicHeader } from '@/components/public-header';
import { CtaButton } from '@/components/ui/cta-button';
import { home } from '@/routes';
import { index as articlesIndex } from '@/routes/articles';
import { index as managementIndex } from '@/routes/management';
import type { ArticlePreview } from '@/types/articles';

export default function NotFound({
    canAccessManagement,
    latestArticles,
}: {
    canAccessManagement: boolean;
    latestArticles: ArticlePreview[];
}) {
    return (
        <>
            <Head title="Página não encontrada" />
            <div className="flex min-h-svh flex-col overflow-hidden bg-linear-to-b from-[#FFFE00] to-[#FFCD00] text-gray-900">
                <PublicHeader />

                <main className="flex-1">
                    <section className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
                        <div className="max-w-2xl">
                            <p className="text-sm font-black tracking-[0.2em] text-[#376b50] uppercase">
                                Erro 404
                            </p>
                            <h1 className="mt-4 text-4xl leading-tight font-black tracking-tight sm:text-6xl">
                                Parece que esta página saiu para brincar.
                            </h1>
                            <p className="mt-5 max-w-xl text-lg leading-8 text-gray-700">
                                A página que procuras não existe ou não está
                                disponível. Podes regressar ao site e continuar
                                a descobrir a Color Fun Parks.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <CtaButton asChild attention="shine">
                                    <Link href={home()}>
                                        <ArrowLeftIcon aria-hidden="true" />
                                        Voltar à página principal
                                    </Link>
                                </CtaButton>

                                {canAccessManagement && (
                                    <Link
                                        href={managementIndex()}
                                        className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-black/15 bg-white/70 px-4 text-sm font-bold text-[#376b50] shadow-xs transition hover:bg-white focus-visible:ring-2 focus-visible:ring-[#376b50] focus-visible:ring-offset-2 focus-visible:outline-none"
                                    >
                                        <LayoutDashboardIcon
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                        Ir para a Gestão
                                    </Link>
                                )}
                            </div>
                        </div>

                        <div
                            aria-hidden="true"
                            className="relative mx-auto grid aspect-square w-full max-w-72 place-items-center rounded-[4rem] border-4 border-white/70 bg-[#558b6e] text-white shadow-2xl sm:max-w-80 lg:rotate-3"
                        >
                            <span className="text-8xl font-black tracking-tighter sm:text-9xl">
                                404
                            </span>
                            <span className="absolute -right-3 -bottom-3 size-16 rounded-full bg-[#ff5c5c] shadow-lg" />
                            <span className="absolute -top-4 -left-3 size-12 rounded-full bg-[#39aef0] shadow-lg" />
                        </div>
                    </section>

                    {latestArticles.length > 0 && (
                        <section className="border-t border-black/10 bg-[#fffdf0]">
                            <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
                                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                                    <div>
                                        <p className="text-sm font-black tracking-[0.18em] text-[#558b6e] uppercase">
                                            Enquanto estás por aqui
                                        </p>
                                        <h2 className="mt-2 text-3xl font-black tracking-tight">
                                            Descobre as últimas novidades
                                        </h2>
                                    </div>
                                    <Link
                                        href={articlesIndex()}
                                        className="inline-flex items-center gap-2 font-bold text-[#376b50] underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-[#376b50] focus-visible:outline-none"
                                    >
                                        <NewspaperIcon
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                        Ver todos os artigos
                                    </Link>
                                </div>

                                <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {latestArticles.map((article) => (
                                        <ArticleCard
                                            key={article.id}
                                            article={article}
                                        />
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}
                </main>

                <PublicFooter className="mt-auto" />
            </div>
        </>
    );
}
