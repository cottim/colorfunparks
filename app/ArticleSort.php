<?php

namespace App;

enum ArticleSort: string
{
    case UpdatedDesc = 'updated_desc';
    case UpdatedAsc = 'updated_asc';
    case PublishedDesc = 'published_desc';
    case PublishedAsc = 'published_asc';
    case CreatedDesc = 'created_desc';
    case CreatedAsc = 'created_asc';
    case TitleAsc = 'title_asc';
    case TitleDesc = 'title_desc';

    public function label(): string
    {
        return match ($this) {
            self::UpdatedDesc => 'Atualização — mais recente',
            self::UpdatedAsc => 'Atualização — mais antiga',
            self::PublishedDesc => 'Publicação — mais recente',
            self::PublishedAsc => 'Publicação — mais antiga',
            self::CreatedDesc => 'Criação — mais recente',
            self::CreatedAsc => 'Criação — mais antiga',
            self::TitleAsc => 'Título — A a Z',
            self::TitleDesc => 'Título — Z a A',
        };
    }

    public function column(): string
    {
        return match ($this) {
            self::UpdatedDesc, self::UpdatedAsc => 'updated_at',
            self::PublishedDesc, self::PublishedAsc => 'published_at',
            self::CreatedDesc, self::CreatedAsc => 'created_at',
            self::TitleAsc, self::TitleDesc => 'title',
        };
    }

    /**
     * @return 'asc'|'desc'
     */
    public function direction(): string
    {
        return match ($this) {
            self::UpdatedDesc,
            self::PublishedDesc,
            self::CreatedDesc,
            self::TitleDesc => 'desc',
            self::UpdatedAsc,
            self::PublishedAsc,
            self::CreatedAsc,
            self::TitleAsc => 'asc',
        };
    }
}
