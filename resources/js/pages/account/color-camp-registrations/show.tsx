import { Head, Link } from '@inertiajs/react';
import { ArrowLeftIcon } from 'lucide-react';
import { StatusPill } from '@/pages/account/color-camp-registrations/index';
import { index as registrationsIndex } from '@/routes/account/color-camp-registrations';
import type { CustomerColorCampRegistration } from '@/types/customer-account';

export default function CustomerColorCampRegistrationShow({
    registration,
}: {
    registration: CustomerColorCampRegistration;
}) {
    return (
        <>
            <Head title={`Color Camp ${registration.reference}`} />
            <Link
                href={registrationsIndex()}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#376b50] hover:underline"
            >
                <ArrowLeftIcon className="size-4" aria-hidden="true" />
                Todas as inscrições
            </Link>

            <header className="mt-6">
                <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                        {registration.reference}
                    </h1>
                    <StatusPill
                        status={registration.status}
                        label={registration.statusLabel}
                    />
                </div>
                <p className="mt-2 text-gray-600">
                    Inscrição de {registration.childName}
                </p>
            </header>

            <div className="mt-8 grid gap-5 xl:grid-cols-2">
                <DetailSection title="Participação">
                    <Detail
                        label="Formato"
                        value={registration.attendanceLabel}
                    />
                    <Detail
                        label="Períodos"
                        value={registration.selectedPeriods.join(', ')}
                    />
                    <Detail label="Almoço" value={registration.lunchOption} />
                    <Detail
                        label="Desconto"
                        value={registration.discount ?? 'Sem desconto'}
                    />
                    <Detail
                        label="Acolhimento/prolongamento"
                        value={registration.needsExtendedCare ? 'Sim' : 'Não'}
                    />
                </DetailSection>
                <DetailSection title="Autorizações">
                    <Detail
                        label="Pessoa autorizada a recolher"
                        value={registration.authorizedPickupName}
                    />
                    <Detail
                        label="Contacto de recolha"
                        value={registration.authorizedPickupPhone}
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
                        label="Autorização de imagem"
                        value={registration.photoConsent}
                    />
                </DetailSection>
                <DetailSection title="Informações da criança">
                    <Detail
                        label="Data de nascimento"
                        value={formatDate(registration.childBirthDate)}
                    />
                    <Detail
                        label="Alergias/saúde"
                        value={
                            registration.allergiesAndHealthNotes ??
                            'Nada indicado'
                        }
                    />
                </DetailSection>
                <DetailSection title="Contacto e observações">
                    <Detail
                        label="Telefone do responsável"
                        value={registration.contactPhone}
                    />
                    <Detail
                        label="Observações"
                        value={registration.notes ?? 'Sem observações'}
                    />
                </DetailSection>
            </div>
        </>
    );
}

function DetailSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-2xl border border-black/10 bg-white/80 p-5 shadow-sm">
            <h2 className="text-lg font-black">{title}</h2>
            <dl className="mt-4 divide-y divide-black/10">{children}</dl>
        </section>
    );
}

function Detail({ label, value }: { label: string; value: string }) {
    return (
        <div className="grid gap-1 py-3 sm:grid-cols-[11rem_1fr] sm:gap-4">
            <dt className="text-sm font-semibold text-gray-500">{label}</dt>
            <dd className="text-sm font-medium whitespace-pre-wrap">{value}</dd>
        </div>
    );
}

function formatDate(value: string): string {
    return new Intl.DateTimeFormat('pt-PT').format(
        new Date(`${value}T00:00:00`),
    );
}
