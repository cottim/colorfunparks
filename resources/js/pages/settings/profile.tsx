import { Form, Head, Link, usePage } from '@inertiajs/react';
import EmailChangeController from '@/actions/App/Http/Controllers/Settings/EmailChangeController';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
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

export default function Profile({
    pendingEmailChange,
}: {
    pendingEmailChange: PendingEmailChange | null;
}) {
    const { auth } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Profile"
                    description="Update your personal information"
                />

                <Form
                    {...ProfileController.update.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>

                                <Input
                                    id="name"
                                    className="mt-1 block w-full"
                                    defaultValue={auth.user.name}
                                    name="name"
                                    required
                                    autoComplete="name"
                                    placeholder="Full name"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.name}
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button
                                    disabled={processing}
                                    data-test="update-profile-button"
                                >
                                    Save
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

                <div className="border-t pt-6">
                    <Heading
                        variant="small"
                        title="Email address"
                        description="Your current verified login address"
                    />

                    <div className="mt-4 rounded-lg border p-4">
                        <p className="font-medium">{auth.user.email}</p>

                        {pendingEmailChange && (
                            <p className="mt-2 text-sm text-muted-foreground">
                                Waiting for confirmation at{' '}
                                <strong>{pendingEmailChange.email}</strong>.
                                Your current email remains active until the new
                                address is confirmed.
                            </p>
                        )}

                        <div className="mt-4 flex flex-wrap gap-3">
                            <Button variant="outline" asChild>
                                <Link href={editEmail()}>
                                    {pendingEmailChange
                                        ? 'Replace pending email'
                                        : 'Change email'}
                                </Link>
                            </Button>

                            {pendingEmailChange && (
                                <Form {...EmailChangeController.destroy.form()}>
                                    {({ processing }) => (
                                        <Button
                                            type="submit"
                                            variant="ghost"
                                            disabled={processing}
                                        >
                                            Cancel change
                                        </Button>
                                    )}
                                </Form>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <DeleteUser />
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Profile settings',
            href: edit(),
        },
    ],
};
