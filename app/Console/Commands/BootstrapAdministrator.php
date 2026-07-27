<?php

namespace App\Console\Commands;

use App\Actions\Management\InviteInternalUser;
use App\Models\User;
use App\UserRole;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

#[Signature('staff:bootstrap {email : Email do primeiro administrador}')]
#[Description('Envia o convite seguro para criar o primeiro administrador')]
class BootstrapAdministrator extends Command
{
    public function handle(InviteInternalUser $inviteInternalUser): int
    {
        if (
            User::query()
                ->where('role', UserRole::Admin)
                ->exists()
        ) {
            $this->error(
                'Já existe um administrador. Envie os próximos convites na área interna.',
            );

            return self::FAILURE;
        }

        $email = Str::lower(trim((string) $this->argument('email')));
        $validator = Validator::make(
            ['email' => $email],
            [
                'email' => [
                    'required',
                    'email',
                    'max:255',
                    Rule::unique((new User)->getTable(), 'email'),
                ],
            ],
        );

        if ($validator->fails()) {
            $this->error($validator->errors()->first('email'));

            return self::FAILURE;
        }

        $inviteInternalUser->handle(
            invitedBy: null,
            email: $email,
            role: UserRole::Admin,
        );

        $this->info(
            'Convite enviado. O administrador deve abrir o email para concluir a conta.',
        );

        return self::SUCCESS;
    }
}
