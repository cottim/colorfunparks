import { Link } from '@inertiajs/react';
import { ArrowRightIcon, BookOpenTextIcon } from 'lucide-react';
import { ArticleCard } from '@/components/articles/article-card';
import { index as articlesIndex } from '@/routes/articles';
import type { ArticlePreview } from '@/types/articles';
import { HomeSectionHeading } from './home-section-heading';

export function BlogSection({ articles }: { articles: ArticlePreview[] }) {
    return (
        <section aria-labelledby="blog-title" className="bg-white/45">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
                <HomeSectionHeading
                    id="blog-title"
                    eyebrow="Novidades e guias"
                    title="Conhece melhor a Color Fun Parks"
                    description="Histórias, informações importantes, ideias para festas e tudo o que acontece nos nossos parques."
                />

                {articles.length > 0 ? (
                    <>
                        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {articles.map((article) => (
                                <ArticleCard
                                    key={article.id}
                                    article={article}
                                />
                            ))}
                        </div>
                        <Link
                            href={articlesIndex()}
                            className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#376b50]/25 bg-white px-5 py-2.5 text-sm font-bold text-[#376b50] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-[#376b50] focus-visible:outline-none"
                        >
                            Ver todas as novidades
                            <ArrowRightIcon
                                className="size-4"
                                aria-hidden="true"
                            />
                        </Link>
                    </>
                ) : (
                    <div className="grid justify-items-center gap-3 rounded-3xl border border-dashed border-black/15 bg-white/70 px-6 py-10 text-center">
                        <BookOpenTextIcon
                            className="size-10 text-[#558b6e]"
                            aria-hidden="true"
                        />
                        <p className="font-bold">Primeiros artigos a caminho</p>
                        <p className="max-w-xl text-sm text-gray-600">
                            Estamos a preparar histórias, guias e informações
                            úteis para partilhar contigo.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
