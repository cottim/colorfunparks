import { useForm } from '@inertiajs/react';
import { ArrowDownIcon, ArrowUpIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import type { ChangeEvent, FormEvent } from 'react';
import AlertError from '@/components/alert-error';
import InputError from '@/components/input-error';
import { ManagementSection } from '@/components/management/management-ui';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type {
    ArticleBlock,
    ArticleBlockType,
    ArticleDetail,
    ArticleEditorOptions,
} from '@/types/articles';

type EditorBlock = ArticleBlock & {
    key: string;
};

type ArticleFormData = {
    title: string;
    subtitle: string;
    excerpt: string;
    category: string;
    status: string;
    blocks: EditorBlock[];
    seo_title: string;
    seo_description: string;
    cover_image: File | null;
    cover_image_alt: string;
    remove_cover: boolean;
    gallery: File[];
    gallery_alt_texts: string[];
    remove_gallery_image_ids: number[];
};

export function ArticleForm({
    article,
    options,
    submitUrl,
}: {
    article?: ArticleDetail;
    options: ArticleEditorOptions;
    submitUrl: string;
}) {
    const form = useForm<ArticleFormData>({
        title: article?.title ?? '',
        subtitle: article?.subtitle ?? '',
        excerpt: article?.excerpt ?? '',
        category: article?.categoryValue ?? options.categories[0]?.value ?? '',
        status: article?.status.value ?? 'draft',
        blocks: article?.blocks.map(toEditorBlock) ?? [
            toEditorBlock({ type: 'paragraph', content: '' }),
        ],
        seo_title: article?.seoTitle ?? '',
        seo_description: article?.seoDescription ?? '',
        cover_image: null,
        cover_image_alt: article?.coverImageAlt ?? '',
        remove_cover: false,
        gallery: [],
        gallery_alt_texts: [],
        remove_gallery_image_ids: [],
    });
    const errors = form.errors as Record<string, string>;

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        form.post(submitUrl, {
            forceFormData: true,
            preserveScroll: true,
        });
    }

    function updateBlock(
        index: number,
        changes: Partial<Pick<EditorBlock, 'type' | 'content'>>,
    ) {
        form.setData(
            'blocks',
            form.data.blocks.map((block, blockIndex) =>
                blockIndex === index ? { ...block, ...changes } : block,
            ),
        );
    }

    function addBlock(type: ArticleBlockType) {
        form.setData('blocks', [
            ...form.data.blocks,
            toEditorBlock({ type, content: '' }),
        ]);
    }

    function moveBlock(index: number, direction: -1 | 1) {
        const nextIndex = index + direction;

        if (nextIndex < 0 || nextIndex >= form.data.blocks.length) {
            return;
        }

        const blocks = [...form.data.blocks];
        [blocks[index], blocks[nextIndex]] = [blocks[nextIndex], blocks[index]];
        form.setData('blocks', blocks);
    }

    function removeBlock(index: number) {
        if (form.data.blocks.length === 1) {
            return;
        }

        form.setData(
            'blocks',
            form.data.blocks.filter((_, blockIndex) => blockIndex !== index),
        );
    }

    function selectGalleryImages(event: ChangeEvent<HTMLInputElement>) {
        const files = Array.from(event.target.files ?? []);
        form.setData('gallery', files);
        form.setData(
            'gallery_alt_texts',
            files.map(() => ''),
        );
    }

    function toggleExistingImage(imageId: number) {
        const selected = form.data.remove_gallery_image_ids;
        form.setData(
            'remove_gallery_image_ids',
            selected.includes(imageId)
                ? selected.filter((id) => id !== imageId)
                : [...selected, imageId],
        );
    }

    return (
        <form onSubmit={submit} className="grid gap-6">
            {Object.keys(errors).length > 0 && (
                <AlertError
                    title="Revê os campos assinalados."
                    errors={Object.values(errors)}
                />
            )}

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
                <div className="grid content-start gap-6">
                    <ManagementSection
                        title="Conteúdo principal"
                        description="Esta informação aparece no artigo e nos cartões da homepage."
                    >
                        <div className="grid gap-5">
                            <Field label="Título" htmlFor="title">
                                <Input
                                    id="title"
                                    value={form.data.title}
                                    onChange={(event) =>
                                        form.setData(
                                            'title',
                                            event.target.value,
                                        )
                                    }
                                    aria-invalid={Boolean(errors.title)}
                                />
                                <InputError message={errors.title} />
                            </Field>

                            <Field
                                label="Subtítulo"
                                htmlFor="subtitle"
                                hint="Opcional. Ajuda a contextualizar o título."
                            >
                                <Input
                                    id="subtitle"
                                    value={form.data.subtitle}
                                    onChange={(event) =>
                                        form.setData(
                                            'subtitle',
                                            event.target.value,
                                        )
                                    }
                                    aria-invalid={Boolean(errors.subtitle)}
                                />
                                <InputError message={errors.subtitle} />
                            </Field>

                            <Field
                                label="Resumo"
                                htmlFor="excerpt"
                                hint="É este texto que aparecerá na homepage e na newsletter."
                            >
                                <textarea
                                    id="excerpt"
                                    rows={4}
                                    value={form.data.excerpt}
                                    onChange={(event) =>
                                        form.setData(
                                            'excerpt',
                                            event.target.value,
                                        )
                                    }
                                    className={textareaClassName}
                                    aria-invalid={Boolean(errors.excerpt)}
                                />
                                <div className="flex justify-between gap-3 text-xs text-muted-foreground">
                                    <InputError message={errors.excerpt} />
                                    <span className="ml-auto">
                                        {form.data.excerpt.length}/500
                                    </span>
                                </div>
                            </Field>
                        </div>
                    </ManagementSection>

                    <ManagementSection
                        title="Editor do artigo"
                        description="Combina blocos e altera a sua ordem para construir o conteúdo."
                    >
                        <div className="grid gap-4">
                            {form.data.blocks.map((block, index) => (
                                <div
                                    key={block.key}
                                    className="grid gap-3 rounded-xl border bg-muted/20 p-4"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <select
                                            value={block.type}
                                            onChange={(event) =>
                                                updateBlock(index, {
                                                    type: event.target
                                                        .value as ArticleBlockType,
                                                })
                                            }
                                            className="h-9 rounded-md border bg-background px-3 text-sm font-semibold"
                                            aria-label={`Tipo do bloco ${index + 1}`}
                                        >
                                            {options.blockTypes.map((type) => (
                                                <option
                                                    key={type.value}
                                                    value={type.value}
                                                >
                                                    {type.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="flex gap-1">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() =>
                                                    moveBlock(index, -1)
                                                }
                                                disabled={index === 0}
                                                aria-label="Mover bloco para cima"
                                            >
                                                <ArrowUpIcon />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() =>
                                                    moveBlock(index, 1)
                                                }
                                                disabled={
                                                    index ===
                                                    form.data.blocks.length - 1
                                                }
                                                aria-label="Mover bloco para baixo"
                                            >
                                                <ArrowDownIcon />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() =>
                                                    removeBlock(index)
                                                }
                                                disabled={
                                                    form.data.blocks.length ===
                                                    1
                                                }
                                                aria-label="Remover bloco"
                                            >
                                                <Trash2Icon />
                                            </Button>
                                        </div>
                                    </div>
                                    <textarea
                                        rows={block.type === 'heading' ? 2 : 6}
                                        value={block.content}
                                        onChange={(event) =>
                                            updateBlock(index, {
                                                content: event.target.value,
                                            })
                                        }
                                        placeholder={
                                            block.type === 'list'
                                                ? 'Um item por linha'
                                                : 'Escreve aqui…'
                                        }
                                        className={textareaClassName}
                                        aria-label={`Conteúdo do bloco ${index + 1}`}
                                        aria-invalid={Boolean(
                                            errors[`blocks.${index}.content`],
                                        )}
                                    />
                                    <InputError
                                        message={
                                            errors[`blocks.${index}.content`]
                                        }
                                    />
                                </div>
                            ))}

                            <div className="flex flex-wrap gap-2 border-t pt-4">
                                {options.blockTypes.map((type) => (
                                    <Button
                                        key={type.value}
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => addBlock(type.value)}
                                    >
                                        <PlusIcon />
                                        {type.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </ManagementSection>

                    <ManagementSection
                        title="Imagens"
                        description="Adiciona uma capa para os cartões e imagens complementares para a galeria."
                    >
                        <div className="grid gap-7">
                            <div className="grid gap-4">
                                <Field
                                    label="Imagem de capa"
                                    htmlFor="cover_image"
                                    hint="JPG, PNG ou WebP, até 5 MB."
                                >
                                    {article?.coverImageUrl &&
                                        !form.data.remove_cover && (
                                            <img
                                                src={article.coverImageUrl}
                                                alt={
                                                    article.coverImageAlt ?? ''
                                                }
                                                className="aspect-16/7 w-full rounded-xl object-cover"
                                            />
                                        )}
                                    <Input
                                        id="cover_image"
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={(event) =>
                                            form.setData(
                                                'cover_image',
                                                event.target.files?.[0] ?? null,
                                            )
                                        }
                                        aria-invalid={Boolean(
                                            errors.cover_image,
                                        )}
                                    />
                                    <InputError message={errors.cover_image} />
                                </Field>

                                {(article?.coverImageUrl ||
                                    form.data.cover_image) && (
                                    <Field
                                        label="Descrição da capa"
                                        htmlFor="cover_image_alt"
                                        hint="Explica brevemente o que aparece na imagem."
                                    >
                                        <Input
                                            id="cover_image_alt"
                                            value={form.data.cover_image_alt}
                                            onChange={(event) =>
                                                form.setData(
                                                    'cover_image_alt',
                                                    event.target.value,
                                                )
                                            }
                                            aria-invalid={Boolean(
                                                errors.cover_image_alt,
                                            )}
                                        />
                                        <InputError
                                            message={errors.cover_image_alt}
                                        />
                                    </Field>
                                )}

                                {article?.coverImageUrl && (
                                    <label className="flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={form.data.remove_cover}
                                            onChange={(event) =>
                                                form.setData(
                                                    'remove_cover',
                                                    event.target.checked,
                                                )
                                            }
                                        />
                                        Remover a capa atual
                                    </label>
                                )}
                            </div>

                            {article && article.images.length > 0 && (
                                <div className="grid gap-3 border-t pt-6">
                                    <h3 className="font-bold">Galeria atual</h3>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {article.images.map((image) => {
                                            const willRemove =
                                                form.data.remove_gallery_image_ids.includes(
                                                    image.id,
                                                );

                                            return (
                                                <label
                                                    key={image.id}
                                                    className="grid cursor-pointer gap-2 rounded-xl border p-3"
                                                >
                                                    <img
                                                        src={image.url}
                                                        alt={image.altText}
                                                        className="aspect-4/3 w-full rounded-lg object-cover"
                                                    />
                                                    <span className="flex items-start gap-2 text-sm">
                                                        <input
                                                            type="checkbox"
                                                            checked={willRemove}
                                                            onChange={() =>
                                                                toggleExistingImage(
                                                                    image.id,
                                                                )
                                                            }
                                                        />
                                                        {willRemove
                                                            ? 'Será removida ao guardar'
                                                            : image.altText}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="grid gap-4 border-t pt-6">
                                <Field
                                    label="Adicionar à galeria"
                                    htmlFor="gallery"
                                    hint="Até 12 imagens por carregamento."
                                >
                                    <Input
                                        id="gallery"
                                        type="file"
                                        multiple
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={selectGalleryImages}
                                        aria-invalid={Boolean(errors.gallery)}
                                    />
                                    <InputError message={errors.gallery} />
                                </Field>

                                {form.data.gallery.map((file, index) => (
                                    <Field
                                        key={`${file.name}-${file.lastModified}`}
                                        label={file.name}
                                        htmlFor={`gallery-alt-${index}`}
                                        hint="Descrição acessível desta imagem."
                                    >
                                        <Input
                                            id={`gallery-alt-${index}`}
                                            value={
                                                form.data.gallery_alt_texts[
                                                    index
                                                ] ?? ''
                                            }
                                            onChange={(event) => {
                                                const altTexts = [
                                                    ...form.data
                                                        .gallery_alt_texts,
                                                ];
                                                altTexts[index] =
                                                    event.target.value;
                                                form.setData(
                                                    'gallery_alt_texts',
                                                    altTexts,
                                                );
                                            }}
                                            aria-invalid={Boolean(
                                                errors[
                                                    `gallery_alt_texts.${index}`
                                                ],
                                            )}
                                        />
                                        <InputError
                                            message={
                                                errors[
                                                    `gallery_alt_texts.${index}`
                                                ]
                                            }
                                        />
                                    </Field>
                                ))}
                            </div>
                        </div>
                    </ManagementSection>
                </div>

                <aside className="grid content-start gap-6">
                    <ManagementSection
                        title="Publicação"
                        description="Controla onde o artigo está no processo editorial."
                    >
                        <div className="grid gap-5">
                            <Field label="Estado" htmlFor="status">
                                <select
                                    id="status"
                                    value={form.data.status}
                                    onChange={(event) =>
                                        form.setData(
                                            'status',
                                            event.target.value,
                                        )
                                    }
                                    className={selectClassName}
                                >
                                    {options.statuses.map((status) => (
                                        <option
                                            key={status.value}
                                            value={status.value}
                                        >
                                            {status.label}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.status} />
                            </Field>

                            <Field label="Categoria" htmlFor="category">
                                <select
                                    id="category"
                                    value={form.data.category}
                                    onChange={(event) =>
                                        form.setData(
                                            'category',
                                            event.target.value,
                                        )
                                    }
                                    className={selectClassName}
                                >
                                    {options.categories.map((category) => (
                                        <option
                                            key={category.value}
                                            value={category.value}
                                        >
                                            {category.label}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.category} />
                            </Field>

                            {form.progress && (
                                <div className="grid gap-2">
                                    <p className="text-sm font-semibold">
                                        A carregar imagens…
                                    </p>
                                    <progress
                                        value={form.progress.percentage}
                                        max="100"
                                        className="w-full"
                                    />
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={form.processing}
                                className="w-full bg-[#558b6e] text-white hover:bg-[#376b50]"
                            >
                                {form.processing
                                    ? 'A guardar…'
                                    : article
                                      ? 'Guardar alterações'
                                      : 'Criar artigo'}
                            </Button>
                        </div>
                    </ManagementSection>

                    <ManagementSection
                        title="SEO"
                        description="Opcional. Se ficar vazio, usamos o título e o resumo."
                    >
                        <div className="grid gap-5">
                            <Field label="Título SEO" htmlFor="seo_title">
                                <Input
                                    id="seo_title"
                                    value={form.data.seo_title}
                                    onChange={(event) =>
                                        form.setData(
                                            'seo_title',
                                            event.target.value,
                                        )
                                    }
                                />
                                <InputError message={errors.seo_title} />
                            </Field>
                            <Field
                                label="Descrição SEO"
                                htmlFor="seo_description"
                            >
                                <textarea
                                    id="seo_description"
                                    rows={4}
                                    value={form.data.seo_description}
                                    onChange={(event) =>
                                        form.setData(
                                            'seo_description',
                                            event.target.value,
                                        )
                                    }
                                    className={textareaClassName}
                                />
                                <InputError message={errors.seo_description} />
                            </Field>
                        </div>
                    </ManagementSection>
                </aside>
            </div>
        </form>
    );
}

function Field({
    label,
    htmlFor,
    hint,
    children,
}: {
    label: string;
    htmlFor: string;
    hint?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={htmlFor}>{label}</Label>
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
            {children}
        </div>
    );
}

function toEditorBlock(block: ArticleBlock): EditorBlock {
    return {
        ...block,
        key: crypto.randomUUID(),
    };
}

const textareaClassName =
    'w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20';

const selectClassName =
    'h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50';
