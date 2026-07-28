<?php

namespace App;

enum ColorCampRegistrationStatus: string
{
    case Pending = 'pending';
    case Reviewing = 'reviewing';
    case Confirmed = 'confirmed';
    case Waitlisted = 'waitlisted';
    case Cancelled = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Pendente',
            self::Reviewing => 'Em análise',
            self::Confirmed => 'Confirmada',
            self::Waitlisted => 'Lista de espera',
            self::Cancelled => 'Cancelada',
        };
    }
}
