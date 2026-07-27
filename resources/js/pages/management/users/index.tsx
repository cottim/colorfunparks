import { Form, Head, usePage } from '@inertiajs/react';
import { MailPlusIcon } from 'lucide-react';
import InternalUserController from '@/actions/App/Http/Controllers/Management/InternalUserController';
import InputError from '@/components/input-error';
import {
    EmptyState,
    formatDate,
    ManagementPageHeader,
    ManagementSection,
    PaginationNav,
    StatusBadge,
} from '@/components/management/management-ui';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { index as usersIndex } from '@/routes/management/users';
import type {
    InternalUser,
    Pagination,
    StaffInvitation,
} from '@/types/management';

type Props = {
    users: Pagination<InternalUser>;
    invitations: StaffInvitation[];
};

export default function ManagementUsers({ users, invitations }: Props) {
    const { flash } = usePage().props;

    return (
        <>
            <Head title="Utilizadores" />
            <div className="flex flex-1 flex-col gap-8 p-4 sm:p-6">
                <ManagementPageHeader
                    eyebrow="Administração"
                    title="Utilizadores"
                    description="Gere quem pode entrar na área interna. As contas só são criadas através de convite."
                />

                {flash.success && (
                    <div
                        role="status"
                        className="rounded-xl border border-[#558b6e]/25 bg-[#558b6e]/10 px-4 py-3 text-sm font-medium text-[#376b50]"
                    >
                        {flash.success}
                    </div>
                )}

                <ManagementSection
                    title="Convidar utilizador"
                    description="O convite é enviado por email, expira em 72 horas e só pode ser utilizado uma vez."
                >
                    <Form
                        {...InternalUserController.store.form()}
                        resetOnSuccess
                        className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_14rem_auto] lg:items-end"
                    >
                        {({ errors, processing, recentlySuccessful }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        autoComplete="email"
                                        placeholder="equipa@exemplo.pt"
                                    />
                                    <InputError message={errors.email} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="role">Função</Label>
                                    <select
                                        id="role"
                                        name="role"
                                        defaultValue="staff"
                                        className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30"
                                    >
                                        <option value="staff">Staff</option>
                                        <option value="admin">
                                            Administrador
                                        </option>
                                    </select>
                                    <InputError message={errors.role} />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-[#558b6e] text-white hover:bg-[#47765d]"
                                >
                                    {processing ? (
                                        <Spinner />
                                    ) : (
                                        <MailPlusIcon />
                                    )}
                                    {recentlySuccessful
                                        ? 'Convite enviado'
                                        : 'Enviar convite'}
                                </Button>
                            </>
                        )}
                    </Form>
                </ManagementSection>

                <ManagementSection
                    title="Convites pendentes"
                    description={`${invitations.length} convite${invitations.length === 1 ? '' : 's'} por aceitar.`}
                >
                    {invitations.length === 0 ? (
                        <EmptyState message="Não existem convites pendentes." />
                    ) : (
                        <div className="grid gap-3">
                            {invitations.map((invitation) => (
                                <article
                                    key={invitation.id}
                                    className="flex flex-col justify-between gap-3 rounded-xl border p-4 sm:flex-row sm:items-center"
                                >
                                    <div>
                                        <p className="font-semibold">
                                            {invitation.email}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Expira em{' '}
                                            {formatDate(invitation.expires_at)}
                                        </p>
                                    </div>
                                    <StatusBadge status={invitation.role} />
                                </article>
                            ))}
                        </div>
                    )}
                </ManagementSection>

                <ManagementSection
                    title="Equipa"
                    description={`${users.total} utilizador${users.total === 1 ? '' : 'es'} interno${users.total === 1 ? '' : 's'}.`}
                >
                    {users.data.length === 0 ? (
                        <EmptyState message="Ainda não existem utilizadores internos." />
                    ) : (
                        <>
                            <div className="grid gap-3">
                                {users.data.map((user) => (
                                    <article
                                        key={user.id}
                                        className="flex flex-col justify-between gap-3 rounded-xl border p-4 sm:flex-row sm:items-center"
                                    >
                                        <div>
                                            <p className="font-semibold">
                                                {user.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {user.email} · desde{' '}
                                                {formatDate(user.created_at)}
                                            </p>
                                        </div>
                                        <StatusBadge status={user.role} />
                                    </article>
                                ))}
                            </div>
                            <PaginationNav
                                pagination={users}
                                label="Paginação de utilizadores"
                            />
                        </>
                    )}
                </ManagementSection>
            </div>
        </>
    );
}

ManagementUsers.layout = {
    breadcrumbs: [
        {
            title: 'Utilizadores',
            href: usersIndex(),
        },
    ],
};
