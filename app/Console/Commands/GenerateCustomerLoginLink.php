<?php

namespace App\Console\Commands;

use App\Actions\Customer\IssueCustomerLoginLink;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

#[Signature('customer:login-link {email : Email do cliente}')]
#[Description('Gera um link local de acesso à conta de cliente sem enviar email')]
class GenerateCustomerLoginLink extends Command
{
    public function handle(
        IssueCustomerLoginLink $issueCustomerLoginLink,
    ): int {
        if (! app()->isLocal()) {
            $this->error(
                'Este comando só está disponível no ambiente local.',
            );

            return self::FAILURE;
        }

        $email = Str::lower(trim((string) $this->argument('email')));
        $validator = Validator::make(
            ['email' => $email],
            [
                'email' => [
                    'required',
                    'string',
                    Rule::email()->rfcCompliant(),
                    'max:255',
                ],
            ],
        );

        if ($validator->fails()) {
            $this->error($validator->errors()->first('email'));

            return self::FAILURE;
        }

        $loginUrl = $issueCustomerLoginLink->handle($email);

        if ($loginUrl === null) {
            $this->error(
                'Este email pertence a uma conta de staff ou administrador.',
            );

            return self::FAILURE;
        }

        $this->info('Link temporário de acesso:');
        $this->line($loginUrl);
        $this->newLine();
        $this->comment(
            'O link só pode ser utilizado uma vez e expira dentro de '
            .config('customer_auth.login_link_expiration_minutes')
            .' minutos.',
        );

        return self::SUCCESS;
    }
}
