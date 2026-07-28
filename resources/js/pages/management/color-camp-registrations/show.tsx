import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeftIcon } from 'lucide-react';
import type { FormEvent } from 'react';
import {
    ManagementPageHeader,
    ManagementSection,
    StatusBadge,
} from '@/components/management/management-ui';
import { Button } from '@/components/ui/button';
import {
    index as registrationsIndex,
    update as updateRegistration,
} from '@/routes/management/color-camp-registrations';
import type { ManagedColorCampRegistration } from '@/types/management';

export default function ManagementColorCampRegistration({
    registration,
}: {
    registration: ManagedColorCampRegistration;
}) {
    const form = useForm({ status: registration.status.value });

    function updateStatus(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        form.patch(updateRegistration.url(registration.id), {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title={registration.reference} />
            <div className="flex flex-1 flex-col gap-6 p-4 sm:p-6">
                <Link
                    href={registrationsIndex()}
                    className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-muted-foreground hover:underline"
                >
                    <ArrowLeftIcon className="size-4" aria-hidden="true" />
                    Voltar ao Color Camp
                </Link>
                <ManagementPageHeader
                    eyebrow="Inscrição Color Camp"
                    title={registration.reference}
                    description={`${registration.childName} · ${registration.customer.name}`}
                    action={<StatusBadge status={registration.status} />}
                />

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
                    <div className="grid content-start gap-6">
                        <ManagementSection
                            title="Participação"
                            description="Períodos e serviços solicitados."
                        >
                            <dl className="grid gap-4 sm:grid-cols-2">
                                <Detail
                                    label="Formato"
                                    value={registration.attendanceLabel}
                                />
                                <Detail
                                    label="Períodos"
                                    value={registration.selectedPeriods.join(
                                        ', ',
                                    )}
                                />
                                <Detail
                                    label="Almoço"
                                    value={registration.lunchOption}
                                />
                                <Detail
                                    label="Desconto"
                                    value={
                                        registration.discount ?? 'Sem desconto'
                                    }
                                />
                                <Detail
                                    label="Acolhimento/prolongamento"
                                    value={
                                        registration.needsExtendedCare
                                            ? 'Sim'
                                            : 'Não'
                                    }
                                />
                                <Detail
                                    label="Data de nascimento"
                                    value={formatDate(
                                        registration.childBirthDate,
                                    )}
                                />
                            </dl>
                        </ManagementSection>
                        <ManagementSection
                            title="Saúde e autorizações"
                            description="Informação sensível necessária à operação da atividade."
                        >
                            <dl className="grid gap-4 sm:grid-cols-2">
                                <Detail
                                    label="Alergias/saúde"
                                    value={
                                        registration.allergiesAndHealthNotes ??
                                        'Nada indicado'
                                    }
                                />
                                <Detail
                                    label="Saídas e transporte"
                                    value={
                                        registration.tripAuthorized
                                            ? 'Autorizado'
                                            : 'Não autorizado'
                                    }
                                />
                                <Detail
                                    label="Pessoa autorizada a recolher"
                                    value={registration.authorizedPickupName}
                                />
                                <Detail
                                    label="Contacto de recolha"
                                    value={registration.authorizedPickupPhone}
                                />
                                <Detail
                                    label="Autorização de imagem"
                                    value={registration.photoConsent}
                                />
                                <Detail
                                    label="Observações"
                                    value={
                                        registration.notes ?? 'Sem observações'
                                    }
                                />
                            </dl>
                        </ManagementSection>
                    </div>

                    <aside className="grid content-start gap-6">
                        <ManagementSection
                            title="Responsável"
                            description="Contacto associado à inscrição."
                        >
                            <dl className="grid gap-4">
                                <Detail
                                    label="Nome"
                                    value={registration.customer.name}
                                />
                                <Detail
                                    label="Email"
                                    value={registration.customer.email}
                                />
                                <Detail
                                    label="Telefone"
                                    value={registration.customer.phone}
                                />
                            </dl>
                        </ManagementSection>
                        <ManagementSection
                            title="Estado"
                            description="Esta alteração fica imediatamente visível na conta do cliente."
                        >
                            <form onSubmit={updateStatus}>
                                <label
                                    htmlFor="status"
                                    className="text-sm font-semibold"
                                >
                                    Estado da inscrição
                                </label>
                                <select
                                    id="status"
                                    value={form.data.status}
                                    onChange={(event) =>
                                        form.setData(
                                            'status',
                                            event.target.value,
                                        )
                                    }
                                    className="mt-2 h-10 w-full rounded-md border bg-background px-3 text-sm"
                                >
                                    {registration.statusOptions.map(
                                        (status) => (
                                            <option
                                                key={status.value}
                                                value={status.value}
                                            >
                                                {status.label}
                                            </option>
                                        ),
                                    )}
                                </select>
                                {form.errors.status && (
                                    <p className="mt-2 text-sm text-destructive">
                                        {form.errors.status}
                                    </p>
                                )}
                                <Button
                                    type="submit"
                                    disabled={form.processing}
                                    className="mt-4 w-full bg-[#558b6e] text-white hover:bg-[#376b50]"
                                >
                                    Guardar estado
                                </Button>
                            </form>
                        </ManagementSection>
                    </aside>
                </div>
            </div>
        </>
    );
}

function Detail({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="mt-1 font-semibold whitespace-pre-wrap">{value}</dd>
        </div>
    );
}

function formatDate(value: string): string {
    return new Intl.DateTimeFormat('pt-PT').format(
        new Date(`${value}T00:00:00`),
    );
}

ManagementColorCampRegistration.layout = {
    breadcrumbs: [
        {
            title: 'Color Camp',
            href: registrationsIndex(),
        },
        {
            title: 'Detalhes',
            href: registrationsIndex(),
        },
    ],
};
