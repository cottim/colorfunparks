import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/staff-invitations';

type Props = {
    email: string;
    role: string;
    token: string;
};

export default function AcceptStaffInvitation({ email, role, token }: Props) {
    return (
        <>
            <Head title="Aceitar convite" />
            <div className="mb-6 rounded-xl border bg-muted/50 px-4 py-3 text-sm">
                <p className="font-semibold">{email}</p>
                <p className="text-muted-foreground">Função: {role}</p>
            </div>
            <Form {...store.form(token)} className="flex flex-col gap-5">
                {({ processing, errors }) => (
                    <>
                        <InputError message={errors.invitation} />
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nome</Label>
                            <Input
                                id="name"
                                name="name"
                                required
                                autoFocus
                                autoComplete="name"
                            />
                            <InputError message={errors.name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Palavra-passe</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={8}
                                autoComplete="new-password"
                            />
                            <InputError message={errors.password} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">
                                Confirmar palavra-passe
                            </Label>
                            <Input
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                                required
                                minLength={8}
                                autoComplete="new-password"
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="h-11 bg-[#558b6e] text-white hover:bg-[#47765d]"
                        >
                            {processing && <Spinner />}
                            Criar conta e entrar
                        </Button>
                    </>
                )}
            </Form>
        </>
    );
}

AcceptStaffInvitation.layout = {
    title: 'Bem-vindo à equipa',
    description: 'Complete os seus dados para ativar o acesso à área interna.',
};
