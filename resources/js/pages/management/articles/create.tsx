import { Head, Link } from '@inertiajs/react';
import { ArrowLeftIcon } from 'lucide-react';
import { ArticleForm } from '@/components/management/article-form';
import { ManagementPageHeader } from '@/components/management/management-ui';
import {
    index as articlesIndex,
    store as storeArticle,
} from '@/routes/management/articles';
import type { ArticleEditorOptions } from '@/types/articles';

export default function CreateArticle({
    options,
}: {
    options: ArticleEditorOptions;
}) {
    return (
        <>
            <Head title="Novo artigo" />
            <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
                <Link
                    href={articlesIndex()}
                    className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-muted-foreground hover:underline"
                >
                    <ArrowLeftIcon className="size-4" aria-hidden="true" />
                    Voltar aos conteúdos
                </Link>
                <ManagementPageHeader
                    eyebrow="Área editorial"
                    title="Novo artigo"
                    description="Começa como rascunho e publica quando o conteúdo estiver revisto."
                />
                <ArticleForm
                    options={options}
                    submitUrl={storeArticle.form().action}
                />
            </div>
        </>
    );
}

CreateArticle.layout = {
    breadcrumbs: [
        {
            title: 'Conteúdos',
            href: articlesIndex(),
        },
        {
            title: 'Novo artigo',
            href: articlesIndex(),
        },
    ],
};
