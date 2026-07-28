import { Form, Head, usePage } from '@inertiajs/react';
import { MailIcon, UserRoundIcon } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { update } from '@/routes/account/profile';

export default function CustomerProfile() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Dados pessoais" />

            <header>
                <p className="text-sm font-bold tracking-wide text-[#558b6e] uppercase">
                    Área de cliente
                </p>
                <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                    Dados pessoais
                </h1>
                <p className="mt-2 max-w-2xl text-gray-600">
                    Mantém o nome associado à tua conta atualizado.
                </p>
            </header>

            <section className="mt-8 max-w-2xl rounded-3xl border border-black/10 bg-white/80 p-5 shadow-sm sm:p-7">
                <div className="flex items-start gap-3 border-b border-black/10 pb-5">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#558b6e]/10 text-[#376b50]">
                        <UserRoundIcon aria-hidden="true" />
                    </span>
                    <div>
                        <h2 className="text-xl font-black">
                            Informação pessoal
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                            Este nome será usado nos teus pedidos e inscrições
                            futuros.
                        </p>
                    </div>
                </div>

                <Form
                    {...update.form()}
                    setDefaultsOnSuccess
                    options={{ preserveScroll: true }}
                    className="mt-6 grid gap-6"
                >
                    {({ errors, processing, recentlySuccessful, isDirty }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="customer-name">Nome</Label>
                                <Input
                                    id="customer-name"
                                    name="name"
                                    defaultValue={auth.user.name}
                                    required
                                    autoComplete="name"
                                    aria-invalid={Boolean(errors.name)}
                                    aria-describedby={
                                        errors.name
                                            ? 'customer-name-error'
                                            : undefined
                                    }
                                    className="h-11 bg-white"
                                />
                                <InputError
                                    id="customer-name-error"
                                    message={errors.name}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="customer-email">Email</Label>
                                <div className="relative">
                                    <MailIcon
                                        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400"
                                        aria-hidden="true"
                                    />
                                    <Input
                                        id="customer-email"
                                        type="email"
                                        value={auth.user.email}
                                        readOnly
                                        className="h-11 bg-gray-50 pl-10 text-gray-600"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 border-t border-black/10 pt-5">
                                <Button
                                    type="submit"
                                    disabled={processing || !isDirty}
                                    className="rounded-xl bg-[#558b6e] text-white hover:bg-[#376b50]"
                                >
                                    {processing
                                        ? 'A guardar…'
                                        : 'Guardar alterações'}
                                </Button>
                                <p
                                    role="status"
                                    aria-live="polite"
                                    className="text-sm font-semibold text-[#376b50]"
                                >
                                    {recentlySuccessful &&
                                        'Alterações guardadas.'}
                                </p>
                            </div>
                        </>
                    )}
                </Form>
            </section>
        </>
    );
}
