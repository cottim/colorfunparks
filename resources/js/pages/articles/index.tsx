import { Head, Link } from '@inertiajs/react';
import { CalendarDaysIcon } from 'lucide-react';
import { ArticleCard } from '@/components/articles/article-card';
import {
    EmptyState,
    PaginationNav,
} from '@/components/management/management-ui';
import { PublicFooter } from '@/components/public-footer';
import { PublicHeader } from '@/components/public-header';
import { CtaButton } from '@/components/ui/cta-button';
import { create as createPartyBooking } from '@/routes/party-bookings';
import type { ArticlePreview } from '@/types/articles';
import type { Pagination } from '@/types/management';

export default function ArticlesIndex({
    articles,
}: {
    articles: Pagination<ArticlePreview>;
}) {
    return (
        <>
            <Head title="Novidades, histórias e guias" />
            <div className="flex min-h-svh flex-col bg-[#fffbea] text-gray-900">
                <PublicHeader>
                    <CtaButton asChild attention="shine">
                        <Link href={createPartyBooking()}>
                            <CalendarDaysIcon />
                            Marcar festa
                        </Link>
                    </CtaButton>
                </PublicHeader>

                <main className="flex-1">
                    <header className="bg-linear-to-br from-[#ffdf33] via-[#ffcb24] to-[#ff9f1c]">
                        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
                            <p className="text-sm font-black tracking-widest text-[#376b50] uppercase">
                                Novidades e guias
                            </p>
                            <h1 className="mt-3 max-w-3xl text-4xl leading-tight font-black sm:text-5xl">
                                Histórias, informação e muita diversão
                            </h1>
                            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-800">
                                Conhece os bastidores, prepara visitas e festas
                                e acompanha tudo o que acontece na Color Fun
                                Parks.
                            </p>
                        </div>
                    </header>

                    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
                        {articles.data.length > 0 ? (
                            <>
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {articles.data.map((article) => (
                                        <ArticleCard
                                            key={article.id}
                                            article={article}
                                        />
                                    ))}
                                </div>
                                <PaginationNav
                                    pagination={articles}
                                    label="Paginação de novidades"
                                />
                            </>
                        ) : (
                            <EmptyState message="Ainda não existem artigos publicados." />
                        )}
                    </section>
                </main>

                <PublicFooter className="mt-auto" />
            </div>
        </>
    );
}
