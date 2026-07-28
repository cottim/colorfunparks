import { Form, Head, usePage } from '@inertiajs/react';
import EmailChangeController from '@/actions/App/Http/Controllers/Settings/EmailChangeController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/profile';
import { edit as editEmail } from '@/routes/profile/email';
import type { Auth } from '@/types';

type PageProps = {
    auth: Auth;
};

type PendingEmailChange = {
    email: string;
    expires_at: string;
};

export default function EmailSettings({
    pendingEmailChange,
}: {
    pendingEmailChange: PendingEmailChange | null;
}) {
    const { auth } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Change email address" />

            <h1 className="sr-only">Change email address</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Change email address"
                    description="The current address remains active until you confirm the new one."
                />

                <div className="rounded-lg border bg-muted/30 p-4 text-sm">
                    <p className="text-muted-foreground">Current email</p>
                    <p className="mt-1 font-semibold">{auth.user.email}</p>
                    {pendingEmailChange && (
                        <>
                            <p className="mt-4 text-muted-foreground">
                                Pending confirmation
                            </p>
                            <p className="mt-1 font-semibold">
                                {pendingEmailChange.email}
                            </p>
                        </>
                    )}
                </div>

                <Form
                    {...EmailChangeController.store.form()}
                    options={{ preserveScroll: true }}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="email">New email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoComplete="email"
                                    placeholder="name@example.com"
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.email}
                                />
                            </div>

                            <p className="text-sm leading-6 text-muted-foreground">
                                We will send a one-time confirmation link to the
                                new address. No account data moves before that
                                link is used.
                            </p>

                            <Button disabled={processing}>
                                Send confirmation
                            </Button>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

EmailSettings.layout = {
    breadcrumbs: [
        {
            title: 'Profile settings',
            href: edit(),
        },
        {
            title: 'Change email',
            href: editEmail(),
        },
    ],
};
