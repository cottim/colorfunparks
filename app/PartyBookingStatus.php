<?php

namespace App;

enum PartyBookingStatus: string
{
    case Pending = 'pending';
    case Contacted = 'contacted';
    case Confirmed = 'confirmed';
    case Cancelled = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pendente',
            self::Contacted => 'Contactado',
            self::Confirmed => 'Confirmado',
            self::Cancelled => 'Cancelado',
        };
    }
}
