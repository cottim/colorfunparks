import { Form, Head } from '@inertiajs/react';
import RequestCustomerLoginLinkController from '@/actions/App/Http/Controllers/RequestCustomerLoginLinkController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

type Props = {
    status?: string;
};

export default function Login({ status }: Props) {
    return (
        <>
            <Head title="Entrar na conta" />

            {status && (
                <div
                    role="status"
                    className="mb-6 rounded-xl border border-[#558b6e]/25 bg-[#558b6e]/10 px-4 py-3 text-sm font-medium text-[#376b50]"
                >
                    {status}
                </div>
            )}

            <Form
                {...RequestCustomerLoginLinkController.form()}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="nome@exemplo.pt"
                                    className="h-11 bg-white"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 h-11 w-full bg-[#558b6e] text-white shadow-sm hover:bg-[#47765d] focus-visible:ring-[#558b6e]/40"
                                tabIndex={2}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Receber link de acesso
                            </Button>
                        </div>

                        <p className="text-center text-sm leading-6 text-gray-500">
                            Não precisas de palavra-passe. O link enviado por
                            email inicia a sessão neste dispositivo.
                        </p>
                    </>
                )}
            </Form>
        </>
    );
}

Login.layout = {
    title: 'Entrar ou criar conta',
    description:
        'Indica o teu email e enviamos-te um link seguro para acederes à tua conta.',
};
