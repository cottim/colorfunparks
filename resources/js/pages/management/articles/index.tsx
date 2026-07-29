import { Form, Head, Link } from '@inertiajs/react';
import { FilePlus2Icon, SearchIcon, SlidersHorizontalIcon } from 'lucide-react';
import {
    EmptyState,
    ManagementPageHeader,
    ManagementSection,
    PaginationNav,
    StatusBadge,
} from '@/components/management/management-ui';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    create as createArticle,
    edit as editArticle,
    index as articlesIndex,
} from '@/routes/management/articles';
import type { ArticlePreview } from '@/types/articles';
import type { Pagination, Status } from '@/types/management';

type ManagedArticlePreview = ArticlePreview & {
    status: Status;
    author: {
        name: string;
    };
    updatedAt: string | null;
};

type ArticleFilters = {
    query: string | null;
    category: string | null;
    author: number | null;
    status: string | null;
    sort: string;
};

type FilterOptions = {
    categories: Array<{ value: string; label: string }>;
    authors: Array<{ value: number; label: string }>;
    statuses: Status[];
    sorts: Array<{ value: string; label: string }>;
};

export default function ManagementArticles({
    articles,
    filters,
    filterOptions,
}: {
    articles: Pagination<ManagedArticlePreview>;
    filters: ArticleFilters;
    filterOptions: FilterOptions;
}) {
    const hasActiveFilters =
        filters.query !== null ||
        filters.category !== null ||
        filters.author !== null ||
        filters.status !== null ||
        filters.sort !== 'updated_desc';

    return (
        <>
            <Head title="Conteúdos" />
            <div className="flex flex-1 flex-col gap-8 p-4 sm:p-6">
                <ManagementPageHeader
                    eyebrow="Área editorial"
                    title="Conteúdos"
                    description="Cria artigos, prepara rascunhos e publica novidades no site."
                    action={
                        <Button
                            asChild
                            className="bg-[#558b6e] text-white hover:bg-[#376b50]"
                        >
                            <Link href={createArticle()}>
                                <FilePlus2Icon />
                                Novo artigo
                            </Link>
                        </Button>
                    }
                />

                <ManagementSection
                    title="Artigos"
                    description={`${articles.total} artigo${articles.total === 1 ? '' : 's'} guardado${articles.total === 1 ? '' : 's'}.`}
                >
                    <ArticleFiltersForm
                        key={JSON.stringify(filters)}
                        filters={filters}
                        options={filterOptions}
                        hasActiveFilters={hasActiveFilters}
                    />
                    {articles.data.length === 0 ? (
                        <EmptyState
                            message={
                                hasActiveFilters
                                    ? 'Não encontrámos artigos com estes filtros.'
                                    : 'Ainda não existem artigos. Cria o primeiro rascunho para começar.'
                            }
                        />
                    ) : (
                        <>
                            <div className="-mx-4 overflow-x-auto sm:-mx-6">
                                <table className="w-full min-w-[58rem] text-left text-sm">
                                    <thead className="border-b text-xs tracking-wide text-muted-foreground uppercase">
                                        <tr>
                                            <th className="px-4 py-3 font-semibold sm:pl-6">
                                                Artigo
                                            </th>
                                            <th className="px-4 py-3 font-semibold">
                                                Categoria
                                            </th>
                                            <th className="px-4 py-3 font-semibold">
                                                Autor
                                            </th>
                                            <th className="px-4 py-3 font-semibold">
                                                Publicado
                                            </th>
                                            <th className="px-4 py-3 font-semibold">
                                                Atualizado
                                            </th>
                                            <th className="px-4 py-3 pr-4 font-semibold sm:pr-6">
                                                Estado
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {articles.data.map((article) => (
                                            <tr
                                                key={article.id}
                                                className="transition-colors hover:bg-muted/40"
                                            >
                                                <td className="px-4 py-4 sm:pl-6">
                                                    <Link
                                                        href={editArticle(
                                                            article.id,
                                                        )}
                                                        className="font-bold text-[#376b50] hover:underline"
                                                    >
                                                        {article.title}
                                                    </Link>
                                                    <p className="mt-1 max-w-md truncate text-xs text-muted-foreground">
                                                        {article.excerpt}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-4">
                                                    {article.category}
                                                </td>
                                                <td className="px-4 py-4">
                                                    {article.author.name}
                                                </td>
                                                <td className="px-4 py-4 text-muted-foreground">
                                                    {formatDate(
                                                        article.publishedAt,
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 text-muted-foreground">
                                                    {formatDate(
                                                        article.updatedAt,
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 pr-4 sm:pr-6">
                                                    <StatusBadge
                                                        status={article.status}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <PaginationNav
                                pagination={articles}
                                label="Paginação dos artigos"
                            />
                        </>
                    )}
                </ManagementSection>
            </div>
        </>
    );
}

function ArticleFiltersForm({
    filters,
    options,
    hasActiveFilters,
}: {
    filters: ArticleFilters;
    options: FilterOptions;
    hasActiveFilters: boolean;
}) {
    return (
        <Form
            {...articlesIndex.form()}
            className="mb-6 rounded-xl border bg-muted/25 p-4"
        >
            <div className="mb-4 flex items-center gap-2">
                <SlidersHorizontalIcon className="size-4 text-[#558b6e]" />
                <h3 className="text-sm font-bold">Filtrar e ordenar</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                <div className="grid gap-2 md:col-span-2 xl:col-span-1">
                    <Label htmlFor="article-query">Pesquisar</Label>
                    <div className="relative">
                        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            id="article-query"
                            name="query"
                            defaultValue={filters.query ?? ''}
                            placeholder="Título ou resumo"
                            className="pl-9"
                        />
                    </div>
                </div>
                <FilterSelect
                    id="article-category"
                    name="category"
                    label="Categoria"
                    value={filters.category}
                    emptyLabel="Todas"
                    options={options.categories}
                />
                <FilterSelect
                    id="article-author"
                    name="author"
                    label="Autor"
                    value={filters.author?.toString() ?? null}
                    emptyLabel="Todos"
                    options={options.authors.map((author) => ({
                        value: author.value.toString(),
                        label: author.label,
                    }))}
                />
                <FilterSelect
                    id="article-status"
                    name="status"
                    label="Estado"
                    value={filters.status}
                    emptyLabel="Todos"
                    options={options.statuses}
                />
                <FilterSelect
                    id="article-sort"
                    name="sort"
                    label="Ordenação"
                    value={filters.sort}
                    options={options.sorts}
                />
            </div>
            <div className="mt-4 flex flex-wrap justify-end gap-2">
                {hasActiveFilters && (
                    <Button variant="ghost" asChild>
                        <Link href={articlesIndex()}>Limpar filtros</Link>
                    </Button>
                )}
                <Button
                    type="submit"
                    className="bg-[#558b6e] text-white hover:bg-[#376b50]"
                >
                    Aplicar
                </Button>
            </div>
        </Form>
    );
}

function FilterSelect({
    id,
    name,
    label,
    value,
    emptyLabel,
    options,
}: {
    id: string;
    name: string;
    label: string;
    value: string | null;
    emptyLabel?: string;
    options: Array<{ value: string; label: string }>;
}) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={id}>{label}</Label>
            <select
                id={id}
                name={name}
                defaultValue={value ?? ''}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30"
            >
                {emptyLabel && <option value="">{emptyLabel}</option>}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

function formatDate(value: string | null): string {
    if (!value) {
        return '—';
    }

    return new Intl.DateTimeFormat('pt-PT', {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(new Date(value));
}

ManagementArticles.layout = {
    breadcrumbs: [
        {
            title: 'Conteúdos',
            href: articlesIndex(),
        },
    ],
};
