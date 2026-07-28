import { Link } from '@inertiajs/react';
import {
    ArrowRightIcon,
    BookOpenTextIcon,
    CalendarDaysIcon,
} from 'lucide-react';
import { HomeSectionHeading } from './home-section-heading';

export type BlogPostPreview = {
    id: string;
    category: string;
    title: string;
    excerpt: string;
    image: string;
    imageAlt: string;
    publishedAt?: string;
    readingTime?: string;
    href?: string;
};

const examplePosts: BlogPostPreview[] = [
    {
        id: 'escolher-programa-festa',
        category: 'Festas',
        title: 'Como escolher o programa certo para a festa',
        excerpt:
            'Idade, horário, número de convidados e tipo de lanche: os pontos que ajudam a encontrar a melhor opção.',
        image: '/img/dia-da-crianca.jpg',
        imageAlt: 'Crianças durante uma atividade Color Fun Parks',
        readingTime: '4 min',
    },
    {
        id: 'checklist-festa-sem-stress',
        category: 'Dicas',
        title: 'Uma checklist para organizar a festa sem stress',
        excerpt:
            'Um guia simples para preparar os convites, confirmar convidados e não deixar nada para a última hora.',
        image: '/img/color_camp_1.jpg',
        imageAlt: 'Grupo de crianças numa atividade acompanhada',
        readingTime: '5 min',
    },
    {
        id: 'primeira-visita-parque',
        category: 'Parques',
        title: 'O que saber antes da primeira visita',
        excerpt:
            'Roupa confortável, meias antiderrapantes e outras sugestões para aproveitar melhor o tempo de brincadeira.',
        image: '/img/color_camp_2.jpg',
        imageAlt: 'Informação de uma atividade Color Fun Parks',
        readingTime: '3 min',
    },
];

export function BlogSection({
    posts = examplePosts,
}: {
    posts?: BlogPostPreview[];
}) {
    return (
        <section aria-labelledby="blog-title" className="bg-white/45">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
                <HomeSectionHeading
                    id="blog-title"
                    eyebrow="Ideias e inspiração"
                    title="Mais diversão começa com uma boa preparação"
                    description="Sugestões práticas para organizar festas, preparar visitas e aproveitar tudo o que os parques têm para oferecer."
                />

                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <BlogCard key={post.id} post={post} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function BlogCard({ post }: { post: BlogPostPreview }) {
    const content = (
        <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="relative aspect-16/10 overflow-hidden bg-gray-100">
                <img
                    src={post.image}
                    alt={post.imageAlt}
                    className="size-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                />
                <span className="absolute top-4 left-4 rounded-full bg-white/95 px-3 py-1 text-xs font-black tracking-wide text-[#376b50] uppercase shadow-sm">
                    {post.category}
                </span>
            </div>

            <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
                <div className="flex items-center gap-3 text-xs font-semibold text-gray-500">
                    {post.publishedAt ? (
                        <span className="inline-flex items-center gap-1.5">
                            <CalendarDaysIcon
                                className="size-3.5"
                                aria-hidden="true"
                            />
                            {post.publishedAt}
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 text-[#558b6e]">
                            <BookOpenTextIcon
                                className="size-3.5"
                                aria-hidden="true"
                            />
                            Em preparação
                        </span>
                    )}
                    {post.readingTime && (
                        <span>{post.readingTime} de leitura</span>
                    )}
                </div>

                <div className="flex flex-1 flex-col gap-3">
                    <h3 className="text-xl leading-tight font-black text-gray-900">
                        {post.title}
                    </h3>
                    <p className="text-sm leading-6 text-gray-600">
                        {post.excerpt}
                    </p>
                </div>

                {post.href && (
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-[#376b50]">
                        Ler artigo
                        <ArrowRightIcon
                            className="size-4 transition-transform group-hover:translate-x-1"
                            aria-hidden="true"
                        />
                    </span>
                )}
            </div>
        </article>
    );

    if (!post.href) {
        return content;
    }

    return (
        <Link
            href={post.href}
            prefetch
            className="rounded-3xl focus-visible:ring-2 focus-visible:ring-[#376b50] focus-visible:ring-offset-2 focus-visible:outline-none"
        >
            {content}
        </Link>
    );
}
