<?php

namespace App;

enum PlayCardStatus: string
{
    case Inactive = 'inactive';
    case Active = 'active';
    case PromotionUnlocked = 'promotion-unlocked';

    public function label(): string
    {
        return match ($this) {
            self::Inactive => 'Inativo',
            self::Active => 'Ativo',
            self::PromotionUnlocked => 'Benefícios ativos',
        };
    }
}
