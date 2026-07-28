import { Head, Link } from '@inertiajs/react';
import {
    EmptyState,
    ManagementPageHeader,
    ManagementSection,
    PaginationNav,
    StatusBadge,
} from '@/components/management/management-ui';
import {
    index as registrationsIndex,
    show as registrationShow,
} from '@/routes/management/color-camp-registrations';
import type {
    ManagedColorCampRegistration,
    Pagination,
} from '@/types/management';

export default function ManagementColorCampRegistrations({
    registrations,
}: {
    registrations: Pagination<ManagedColorCampRegistration>;
}) {
    return (
        <>
            <Head title="Color Camp" />
            <div className="flex flex-1 flex-col gap-8 p-4 sm:p-6">
                <ManagementPageHeader
                    eyebrow="Inscrições"
                    title="Color Camp"
                    description="Revê os pedidos, confirma vagas e acompanha cada participante."
                />
                <ManagementSection
                    title="Inscrições recebidas"
                    description={`${registrations.total} inscrição${registrations.total === 1 ? '' : 'ões'} guardada${registrations.total === 1 ? '' : 's'}.`}
                >
                    {registrations.data.length === 0 ? (
                        <EmptyState message="Ainda não existem inscrições no Color Camp." />
                    ) : (
                        <>
                            <div className="-mx-4 overflow-x-auto sm:-mx-6">
                                <table className="w-full min-w-[62rem] text-left text-sm">
                                    <thead className="border-b text-xs tracking-wide text-muted-foreground uppercase">
                                        <tr>
                                            <th className="px-4 py-3 font-semibold sm:pl-6">
                                                Inscrição
                                            </th>
                                            <th className="px-4 py-3 font-semibold">
                                                Criança
                                            </th>
                                            <th className="px-4 py-3 font-semibold">
                                                Responsável
                                            </th>
                                            <th className="px-4 py-3 font-semibold">
                                                Frequência
                                            </th>
                                            <th className="px-4 py-3 font-semibold">
                                                Recebida em
                                            </th>
                                            <th className="px-4 py-3 pr-4 font-semibold sm:pr-6">
                                                Estado
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {registrations.data.map(
                                            (registration) => (
                                                <tr
                                                    key={registration.id}
                                                    className="hover:bg-muted/40"
                                                >
                                                    <td className="px-4 py-4 sm:pl-6">
                                                        <Link
                                                            href={registrationShow(
                                                                registration.id,
                                                            )}
                                                            className="font-bold text-[#376b50] hover:underline"
                                                        >
                                                            {
                                                                registration.reference
                                                            }
                                                        </Link>
                                                    </td>
                                                    <td className="px-4 py-4 font-medium">
                                                        {registration.childName}
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <p className="font-medium">
                                                            {
                                                                registration
                                                                    .customer
                                                                    .name
                                                            }
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {
                                                                registration
                                                                    .customer
                                                                    .email
                                                            }
                                                        </p>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <p className="font-medium">
                                                            {
                                                                registration.attendanceLabel
                                                            }
                                                        </p>
                                                        <p className="max-w-64 truncate text-xs text-muted-foreground">
                                                            {registration.selectedPeriods.join(
                                                                ' · ',
                                                            )}
                                                        </p>
                                                    </td>
                                                    <td className="px-4 py-4 text-muted-foreground">
                                                        {formatDate(
                                                            registration.createdAt,
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-4 pr-4 sm:pr-6">
                                                        <StatusBadge
                                                            status={
                                                                registration.status
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <PaginationNav
                                pagination={registrations}
                                label="Paginação das inscrições Color Camp"
                            />
                        </>
                    )}
                </ManagementSection>
            </div>
        </>
    );
}

function formatDate(value: string): string {
    return new Intl.DateTimeFormat('pt-PT', {
        dateStyle: 'short',
        timeStyle: 'short',
    }).format(new Date(value));
}

ManagementColorCampRegistrations.layout = {
    breadcrumbs: [
        {
            title: 'Color Camp',
            href: registrationsIndex(),
        },
    ],
};
