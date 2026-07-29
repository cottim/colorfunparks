import { Head, Link } from '@inertiajs/react';
import { ArrowLeftIcon, CalendarDaysIcon, Clock3Icon } from 'lucide-react';
import { PublicFooter } from '@/components/public-footer';
import { PublicHeader } from '@/components/public-header';
import { index as articlesIndex } from '@/routes/articles';
import type { ArticleBlock, ArticleDetail } from '@/types/articles';

export default function ArticleShow({ article }: { article: ArticleDetail }) {
    return (
        <>
            <Head title={article.seoTitle ?? article.title}>
                <meta
                    name="description"
                    content={article.seoDescription ?? article.excerpt}
                />
                <meta property="og:title" content={article.title} />
                <meta property="og:description" content={article.excerpt} />
                {article.coverImageUrl && (
                    <meta property="og:image" content={article.coverImageUrl} />
                )}
            </Head>
            <div className="flex min-h-svh flex-col bg-[#fffdf4] text-gray-900">
                <PublicHeader />

                <main className="flex-1">
                    <article>
                        <header className="bg-linear-to-b from-[#ffe66d] to-[#fff3b0]">
                            <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
                                <Link
                                    href={articlesIndex()}
                                    className="inline-flex items-center gap-2 text-sm font-bold text-[#376b50] hover:underline focus-visible:ring-2 focus-visible:ring-[#376b50] focus-visible:outline-none"
                                >
                                    <ArrowLeftIcon
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                    Todas as novidades
                                </Link>

                                <div className="mt-8 flex flex-wrap items-center gap-3 text-sm font-bold text-gray-600">
                                    <span className="rounded-full bg-white/80 px-3 py-1 text-[#376b50]">
                                        {article.category}
                                    </span>
                                    {article.publishedAt && (
                                        <span className="inline-flex items-center gap-1.5">
                                            <CalendarDaysIcon
                                                className="size-4"
                                                aria-hidden="true"
                                            />
                                            {formatDate(article.publishedAt)}
                                        </span>
                                    )}
                                    <span className="inline-flex items-center gap-1.5">
                                        <Clock3Icon
                                            className="size-4"
                                            aria-hidden="true"
                                        />
                                        {article.readingTime} min de leitura
                                    </span>
                                </div>

                                <h1 className="mt-5 text-4xl leading-tight font-black sm:text-6xl">
                                    {article.title}
                                </h1>
                                {article.subtitle && (
                                    <p className="mt-5 max-w-3xl text-xl leading-8 text-gray-700">
                                        {article.subtitle}
                                    </p>
                                )}
                            </div>
                        </header>

                        {article.coverImageUrl && (
                            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                                <img
                                    src={article.coverImageUrl}
                                    alt={article.coverImageAlt ?? ''}
                                    className="-mt-1 aspect-16/8 w-full rounded-3xl object-cover shadow-xl"
                                />
                            </div>
                        )}

                        <div className="mx-auto grid max-w-3xl gap-7 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
                            <p className="text-xl leading-9 font-semibold text-gray-700">
                                {article.excerpt}
                            </p>

                            {article.blocks.map((block, index) => (
                                <ArticleContentBlock
                                    key={`${block.type}-${index}`}
                                    block={block}
                                />
                            ))}
                        </div>

                        {article.images.length > 0 && (
                            <section
                                aria-labelledby="article-gallery-title"
                                className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8"
                            >
                                <h2
                                    id="article-gallery-title"
                                    className="mb-6 text-2xl font-black"
                                >
                                    Galeria
                                </h2>
                                <div className="grid gap-5 sm:grid-cols-2">
                                    {article.images.map((image) => (
                                        <figure
                                            key={image.id}
                                            className="overflow-hidden rounded-3xl bg-white shadow-lg"
                                        >
                                            <img
                                                src={image.url}
                                                alt={image.altText}
                                                className="aspect-4/3 w-full object-cover"
                                                loading="lazy"
                                            />
                                            {image.caption && (
                                                <figcaption className="px-4 py-3 text-sm text-gray-600">
                                                    {image.caption}
                                                </figcaption>
                                            )}
                                        </figure>
                                    ))}
                                </div>
                            </section>
                        )}
                    </article>
                </main>

                <PublicFooter className="mt-auto" />
            </div>
        </>
    );
}

function ArticleContentBlock({ block }: { block: ArticleBlock }) {
    if (block.type === 'heading') {
        return (
            <h2 className="pt-3 text-3xl leading-tight font-black">
                {block.content}
            </h2>
        );
    }

    if (block.type === 'callout') {
        return (
            <aside className="rounded-3xl border-l-8 border-[#558b6e] bg-[#e9f5ee] px-6 py-5 text-lg leading-8 font-semibold text-gray-800">
                {block.content}
            </aside>
        );
    }

    if (block.type === 'list') {
        return (
            <ul className="grid list-disc gap-3 pl-6 text-lg leading-8 text-gray-700 marker:text-[#558b6e]">
                {block.content
                    .split('\n')
                    .map((item) => item.trim())
                    .filter(Boolean)
                    .map((item, index) => (
                        <li key={`${item}-${index}`}>{item}</li>
                    ))}
            </ul>
        );
    }

    return (
        <p className="text-lg leading-8 whitespace-pre-line text-gray-700">
            {block.content}
        </p>
    );
}

function formatDate(value: string): string {
    return new Intl.DateTimeFormat('pt-PT', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(value));
}
