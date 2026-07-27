import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store as login } from '@/routes/login';

export default function AdminLogin() {
    return (
        <>
            <Head title="Área interna" />
            <Form {...login.form()} className="flex flex-col gap-6">
                {({ processing, errors }) => (
                    <>
                        <input type="hidden" name="remember" value="1" />
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                autoFocus
                                autoComplete="email"
                            />
                            <InputError message={errors.email} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Palavra-passe</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                autoComplete="current-password"
                            />
                            <InputError message={errors.password} />
                        </div>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="h-11 bg-[#558b6e] text-white hover:bg-[#47765d]"
                        >
                            {processing && <Spinner />}
                            Entrar
                        </Button>
                    </>
                )}
            </Form>
        </>
    );
}

AdminLogin.layout = {
    title: 'Área de staff',
    description:
        'Acesso reservado a membros da equipa convidados pela administração.',
};
