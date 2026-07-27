import { Head } from '@inertiajs/react';
import {
    EmptyState,
    formatDate,
    ManagementPageHeader,
    ManagementSection,
    PaginationNav,
    StatusBadge,
} from '@/components/management/management-ui';
import { index as customersIndex } from '@/routes/management/customers';
import type { ManagedCustomer, Pagination } from '@/types/management';

export default function ManagementCustomers({
    customers,
}: {
    customers: Pagination<ManagedCustomer>;
}) {
    return (
        <>
            <Head title="Clientes" />
            <div className="flex flex-1 flex-col gap-8 p-4 sm:p-6">
                <ManagementPageHeader
                    eyebrow="Contactos"
                    title="Clientes"
                    description="Consulta os clientes, os pedidos associados e o respetivo consentimento de marketing."
                />
                <ManagementSection
                    title="Clientes registados"
                    description={`${customers.total} cliente${customers.total === 1 ? '' : 's'} registado${customers.total === 1 ? '' : 's'}.`}
                >
                    {customers.data.length === 0 ? (
                        <EmptyState message="Ainda não existem clientes registados." />
                    ) : (
                        <>
                            <div className="grid gap-3 md:hidden">
                                {customers.data.map((customer) => (
                                    <CustomerCard
                                        key={customer.id}
                                        customer={customer}
                                    />
                                ))}
                            </div>
                            <CustomersTable customers={customers.data} />
                            <PaginationNav
                                pagination={customers}
                                label="Paginação de clientes"
                            />
                        </>
                    )}
                </ManagementSection>
            </div>
        </>
    );
}

function CustomerCard({ customer }: { customer: ManagedCustomer }) {
    return (
        <article className="grid gap-4 rounded-xl border p-4">
            <div>
                <p className="font-semibold">{customer.name || 'Sem nome'}</p>
                <p className="text-sm break-all text-muted-foreground">
                    {customer.email}
                </p>
            </div>
            <StatusBadge status={customer.marketing} />
            <dl className="grid gap-2 text-sm">
                <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Festas</dt>
                    <dd className="font-semibold">
                        {customer.party_bookings_count}
                    </dd>
                </div>
                <div className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">Registo</dt>
                    <dd>{formatDate(customer.created_at)}</dd>
                </div>
            </dl>
        </article>
    );
}

function CustomersTable({ customers }: { customers: ManagedCustomer[] }) {
    return (
        <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-3xl text-left text-sm">
                <thead className="border-b text-xs tracking-wide text-muted-foreground uppercase">
                    <tr>
                        <th className="px-3 py-3 font-semibold">Cliente</th>
                        <th className="px-3 py-3 font-semibold">Marketing</th>
                        <th className="px-3 py-3 text-center font-semibold">
                            Festas
                        </th>
                        <th className="px-3 py-3 text-right font-semibold">
                            Registo
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {customers.map((customer) => (
                        <tr key={customer.id}>
                            <td className="px-3 py-4">
                                <p className="font-semibold">
                                    {customer.name || 'Sem nome'}
                                </p>
                                <p className="text-muted-foreground">
                                    {customer.email}
                                </p>
                            </td>
                            <td className="px-3 py-4">
                                <StatusBadge status={customer.marketing} />
                            </td>
                            <td className="px-3 py-4 text-center font-semibold">
                                {customer.party_bookings_count}
                            </td>
                            <td className="px-3 py-4 text-right">
                                {formatDate(customer.created_at)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

ManagementCustomers.layout = {
    breadcrumbs: [
        {
            title: 'Clientes',
            href: customersIndex(),
        },
    ],
};
