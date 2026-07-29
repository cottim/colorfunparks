import { Link } from '@inertiajs/react';
import {
    ArrowRightIcon,
    BookOpenTextIcon,
    CalendarDaysIcon,
} from 'lucide-react';
import { show as showArticle } from '@/routes/articles';
import type { ArticlePreview } from '@/types/articles';

export function ArticleCard({ article }: { article: ArticlePreview }) {
    return (
        <Link
            href={showArticle(article.slug)}
            prefetch
            className="group rounded-3xl focus-visible:ring-2 focus-visible:ring-[#376b50] focus-visible:ring-offset-2 focus-visible:outline-none"
        >
            <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-lg transition duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
                <div className="relative aspect-16/10 overflow-hidden bg-linear-to-br from-[#ffe66d] to-[#ff9f1c]">
                    {article.coverImageUrl ? (
                        <img
                            src={article.coverImageUrl}
                            alt={article.coverImageAlt ?? ''}
                            className="size-full object-cover transition duration-500 group-hover:scale-105"
                            loading="lazy"
                        />
                    ) : (
                        <span className="grid size-full place-items-center text-white/90">
                            <BookOpenTextIcon
                                className="size-14"
                                aria-hidden="true"
                            />
                        </span>
                    )}
                    <span className="absolute top-4 left-4 rounded-full bg-white/95 px-3 py-1 text-xs font-black tracking-wide text-[#376b50] uppercase shadow-sm">
                        {article.category}
                    </span>
                </div>

                <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
                    <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-500">
                        {article.publishedAt && (
                            <span className="inline-flex items-center gap-1.5">
                                <CalendarDaysIcon
                                    className="size-3.5"
                                    aria-hidden="true"
                                />
                                {formatDate(article.publishedAt)}
                            </span>
                        )}
                        <span>{article.readingTime} min de leitura</span>
                    </div>

                    <div className="flex flex-1 flex-col gap-3">
                        <h3 className="text-xl leading-tight font-black text-gray-900">
                            {article.title}
                        </h3>
                        <p className="text-sm leading-6 text-gray-600">
                            {article.excerpt}
                        </p>
                    </div>

                    <span className="inline-flex items-center gap-2 text-sm font-bold text-[#376b50]">
                        Ler artigo
                        <ArrowRightIcon
                            className="size-4 transition-transform group-hover:translate-x-1"
                            aria-hidden="true"
                        />
                    </span>
                </div>
            </article>
        </Link>
    );
}

function formatDate(value: string): string {
    return new Intl.DateTimeFormat('pt-PT', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(new Date(value));
}
