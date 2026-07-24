<?php

namespace App;

enum UserRole: string
{
    case Customer = 'customer';
    case Staff = 'staff';
    case Admin = 'admin';

    public function label(): string
    {
        return match ($this) {
            self::Customer => 'Cliente',
            self::Staff => 'Staff',
            self::Admin => 'Administrador',
        };
    }

    public function canAccessManagement(): bool
    {
        return match ($this) {
            self::Customer => false,
            self::Staff, self::Admin => true,
        };
    }
}
