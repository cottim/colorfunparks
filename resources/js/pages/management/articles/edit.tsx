import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeftIcon, ExternalLinkIcon, Trash2Icon } from 'lucide-react';
import { ArticleForm } from '@/components/management/article-form';
import { ManagementPageHeader } from '@/components/management/management-ui';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { show as showArticle } from '@/routes/articles';
import {
    destroy as destroyArticle,
    index as articlesIndex,
    update as updateArticle,
} from '@/routes/management/articles';
import type { ArticleDetail, ArticleEditorOptions } from '@/types/articles';

export default function EditArticle({
    article,
    options,
    permissions,
}: {
    article: ArticleDetail;
    options: ArticleEditorOptions;
    permissions: {
        delete: boolean;
    };
}) {
    return (
        <>
            <Head title={`Editar ${article.title}`} />
            <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
                <Link
                    href={articlesIndex()}
                    className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-muted-foreground hover:underline"
                >
                    <ArrowLeftIcon className="size-4" aria-hidden="true" />
                    Voltar aos conteúdos
                </Link>
                <ManagementPageHeader
                    eyebrow="Editar artigo"
                    title={article.title}
                    description={`Estado atual: ${article.status.label}.`}
                    action={
                        <div className="flex flex-wrap gap-2">
                            {article.status.value === 'published' && (
                                <Button asChild variant="outline">
                                    <Link
                                        href={showArticle(article.slug)}
                                        target="_blank"
                                    >
                                        <ExternalLinkIcon />
                                        Ver no site
                                    </Link>
                                </Button>
                            )}
                            {permissions.delete && (
                                <DeleteArticleDialog article={article} />
                            )}
                        </div>
                    }
                />
                <ArticleForm
                    article={article}
                    options={options}
                    submitUrl={updateArticle.form(article.id).action}
                />
            </div>
        </>
    );
}

function DeleteArticleDialog({ article }: { article: ArticleDetail }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button type="button" variant="destructive">
                    <Trash2Icon />
                    Eliminar
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Eliminar “{article.title}”?</DialogTitle>
                    <DialogDescription>
                        O artigo e todas as imagens carregadas serão removidos
                        definitivamente.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            Cancelar
                        </Button>
                    </DialogClose>
                    <Form {...destroyArticle.form(article.id)}>
                        {({ processing }) => (
                            <Button
                                type="submit"
                                variant="destructive"
                                disabled={processing}
                            >
                                {processing
                                    ? 'A eliminar…'
                                    : 'Eliminar definitivamente'}
                            </Button>
                        )}
                    </Form>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

EditArticle.layout = {
    breadcrumbs: [
        {
            title: 'Conteúdos',
            href: articlesIndex(),
        },
        {
            title: 'Editar artigo',
            href: articlesIndex(),
        },
    ],
};
