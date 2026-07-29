import type { Status } from '@/types/management';

export type ArticleBlockType = 'heading' | 'paragraph' | 'callout' | 'list';

export type ArticleBlock = {
    type: ArticleBlockType;
    content: string;
};

export type ArticlePreview = {
    id: number;
    slug: string;
    category: string;
    title: string;
    subtitle: string | null;
    excerpt: string;
    coverImageUrl: string | null;
    coverImageAlt: string | null;
    publishedAt: string | null;
    readingTime: number;
};

export type ArticleImage = {
    id: number;
    url: string;
    altText: string;
    caption: string | null;
};

export type ArticleDetail = ArticlePreview & {
    status: Status;
    author: {
        name: string;
    };
    updatedAt: string | null;
    categoryValue: string;
    blocks: ArticleBlock[];
    seoTitle: string | null;
    seoDescription: string | null;
    images: ArticleImage[];
};

export type ArticleEditorOptions = {
    categories: Array<{ value: string; label: string }>;
    blockTypes: Array<{ value: ArticleBlockType; label: string }>;
    statuses: Status[];
};
