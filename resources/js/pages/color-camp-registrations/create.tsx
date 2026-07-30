import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeftIcon, CheckCircle2Icon, ShieldCheckIcon } from 'lucide-react';
import type { FormEvent } from 'react';
import { PublicFooter } from '@/components/public-footer';
import { PublicHeader } from '@/components/public-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { store as storeRegistration } from '@/routes/color-camp-registrations';
import { privacyPolicy, termsAndConditions } from '@/routes/legal';
import { colorCamp as colorCampService } from '@/routes/services';

type Option = {
    value: string;
    label: string;
};

type AvailabilityOption = Option & {
    available: boolean;
};

type RegistrationOptions = {
    season: string;
    minimumAge: number;
    maximumAge: number;
    weeks: AvailabilityOption[];
    days: Option[];
    lunchOptions: Option[];
    discounts: Option[];
    photoConsents: Option[];
};

type AuthenticatedCustomer = {
    name: string;
    email: string;
};

type RegistrationForm = {
    contact_name: string;
    email: string;
    phone: string;
    child_name: string;
    child_birth_date: string;
    allergies_and_health_notes: string;
    health_data_consent: boolean;
    authorized_pickup_name: string;
    authorized_pickup_phone: string;
    attendance_type: 'weeks' | 'days';
    selected_weeks: string[];
    selected_days: string[];
    lunch_option: string;
    discount: string;
    needs_extended_care: boolean;
    trip_authorized: boolean;
    photo_consent: string;
    notes: string;
    privacy_accepted: boolean;
    terms_accepted: boolean;
    website: string;
};

export default function CreateColorCampRegistration({
    authenticatedCustomer,
    registrationOptions,
}: {
    authenticatedCustomer: AuthenticatedCustomer | null;
    registrationOptions: RegistrationOptions;
}) {
    const form = useForm<RegistrationForm>({
        contact_name: '',
        email: '',
        phone: '',
        child_name: '',
        child_birth_date: '',
        allergies_and_health_notes: '',
        health_data_consent: false,
        authorized_pickup_name: authenticatedCustomer?.name ?? '',
        authorized_pickup_phone: '',
        attendance_type: 'weeks',
        selected_weeks: [],
        selected_days: [],
        lunch_option: '',
        discount: '',
        needs_extended_care: false,
        trip_authorized: false,
        photo_consent: '',
        notes: '',
        privacy_accepted: false,
        terms_accepted: false,
        website: '',
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        form.post(storeRegistration.url(), {
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head
                title={`Inscrição Color Camp — ${registrationOptions.season}`}
            />

            <div className="flex min-h-svh flex-col bg-linear-to-b from-[#fffef0] via-[#fff9c7] to-[#ffcd00] text-gray-900">
                <PublicHeader>
                    <Link
                        href={colorCampService()}
                        className="inline-flex size-10 items-center justify-center rounded-full hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-[#376b50] focus-visible:outline-none sm:w-auto sm:gap-2 sm:px-3"
                    >
                        <ArrowLeftIcon className="size-4" aria-hidden="true" />
                        <span className="hidden text-sm font-semibold sm:inline">
                            Color Camp
                        </span>
                    </Link>
                </PublicHeader>

                <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                    <header className="mx-auto max-w-3xl text-center">
                        <p className="text-sm font-bold tracking-wide text-[#376b50] uppercase">
                            {registrationOptions.season}
                        </p>
                        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl">
                            Inscrição no Color Camp
                        </h1>
                        <p className="mt-4 leading-7 text-gray-700">
                            Indica-nos os dados da criança e os dias
                            pretendidos. A equipa confirmará a disponibilidade e
                            os próximos passos.
                        </p>
                    </header>

                    <form
                        onSubmit={submit}
                        className="mt-8 space-y-5"
                        noValidate
                    >
                        <FormSection
                            eyebrow="Responsável"
                            title="Como podemos entrar em contacto?"
                        >
                            {authenticatedCustomer ? (
                                <div className="flex gap-3 rounded-2xl border border-[#558b6e]/25 bg-[#558b6e]/8 p-4 sm:col-span-2">
                                    <ShieldCheckIcon
                                        className="mt-0.5 size-5 shrink-0 text-[#376b50]"
                                        aria-hidden="true"
                                    />
                                    <div>
                                        <p className="font-bold">
                                            Inscrição associada à tua conta
                                        </p>
                                        <p className="mt-1 text-sm text-gray-600">
                                            {authenticatedCustomer.name} ·{' '}
                                            {authenticatedCustomer.email}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-500">
                                            O nome e o email são obtidos de
                                            forma segura a partir da sessão.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <TextField
                                        id="contact_name"
                                        label="Nome do responsável"
                                        value={form.data.contact_name}
                                        onChange={(value) =>
                                            form.setData('contact_name', value)
                                        }
                                        error={form.errors.contact_name}
                                        autoComplete="name"
                                        required
                                    />
                                    <TextField
                                        id="email"
                                        type="email"
                                        label="Email"
                                        value={form.data.email}
                                        onChange={(value) =>
                                            form.setData('email', value)
                                        }
                                        error={form.errors.email}
                                        autoComplete="email"
                                        required
                                    />
                                </>
                            )}
                            <TextField
                                id="phone"
                                type="tel"
                                label="Telefone"
                                value={form.data.phone}
                                onChange={(value) =>
                                    form.setData('phone', value)
                                }
                                error={form.errors.phone}
                                autoComplete="tel"
                                required
                            />
                        </FormSection>

                        <FormSection
                            eyebrow="Participante"
                            title="Fala-nos um pouco da criança"
                        >
                            <TextField
                                id="child_name"
                                label="Nome da criança"
                                value={form.data.child_name}
                                onChange={(value) =>
                                    form.setData('child_name', value)
                                }
                                error={form.errors.child_name}
                                required
                            />
                            <TextField
                                id="child_birth_date"
                                type="date"
                                label="Data de nascimento"
                                description={`Para crianças dos ${registrationOptions.minimumAge} aos ${registrationOptions.maximumAge} anos.`}
                                value={form.data.child_birth_date}
                                onChange={(value) =>
                                    form.setData('child_birth_date', value)
                                }
                                error={form.errors.child_birth_date}
                                required
                            />
                            <div className="space-y-3 sm:col-span-2">
                                <TextAreaField
                                    id="allergies_and_health_notes"
                                    label="Alergias ou informações de saúde relevantes"
                                    description="Partilha apenas o que a equipa precisa de saber para cuidar da criança em segurança."
                                    value={form.data.allergies_and_health_notes}
                                    onChange={(value) => {
                                        form.setData(
                                            'allergies_and_health_notes',
                                            value,
                                        );

                                        if (value.trim() === '') {
                                            form.setData(
                                                'health_data_consent',
                                                false,
                                            );
                                        }
                                    }}
                                    error={
                                        form.errors.allergies_and_health_notes
                                    }
                                />
                                {form.data.allergies_and_health_notes.trim() !==
                                    '' && (
                                    <div className="rounded-xl border border-[#558b6e]/25 bg-[#558b6e]/8 p-4">
                                        <ConsentField
                                            checked={
                                                form.data.health_data_consent
                                            }
                                            onChange={(checked) =>
                                                form.setData(
                                                    'health_data_consent',
                                                    checked,
                                                )
                                            }
                                            error={
                                                form.errors.health_data_consent
                                            }
                                        >
                                            Autorizo explicitamente o tratamento
                                            das informações de saúde indicadas
                                            acima, exclusivamente para garantir
                                            a segurança e os cuidados da criança
                                            durante o Color Camp.
                                        </ConsentField>
                                    </div>
                                )}
                            </div>
                        </FormSection>

                        <FormSection
                            eyebrow="Frequência"
                            title="Quando pretende participar?"
                        >
                            <div className="grid grid-cols-2 gap-2 sm:col-span-2">
                                {(['weeks', 'days'] as const).map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() =>
                                            form.setData(
                                                'attendance_type',
                                                type,
                                            )
                                        }
                                        className={cn(
                                            'rounded-xl border px-4 py-3 text-sm font-bold transition focus-visible:ring-2 focus-visible:ring-[#376b50] focus-visible:outline-none',
                                            form.data.attendance_type === type
                                                ? 'border-[#558b6e] bg-[#558b6e] text-white'
                                                : 'border-black/10 bg-white hover:border-[#558b6e]/50',
                                        )}
                                    >
                                        {type === 'weeks'
                                            ? 'Semanas completas'
                                            : 'Dias avulso'}
                                    </button>
                                ))}
                            </div>

                            {form.data.attendance_type === 'weeks' ? (
                                <ChoiceGrid
                                    options={registrationOptions.weeks}
                                    selected={form.data.selected_weeks}
                                    onToggle={(value) =>
                                        form.setData(
                                            'selected_weeks',
                                            toggleValue(
                                                form.data.selected_weeks,
                                                value,
                                            ),
                                        )
                                    }
                                    error={
                                        form.errors.selected_weeks ??
                                        form.errors['selected_weeks.0']
                                    }
                                />
                            ) : (
                                <ChoiceGrid
                                    options={registrationOptions.days}
                                    selected={form.data.selected_days}
                                    onToggle={(value) =>
                                        form.setData(
                                            'selected_days',
                                            toggleValue(
                                                form.data.selected_days,
                                                value,
                                            ),
                                        )
                                    }
                                    error={
                                        form.errors.selected_days ??
                                        form.errors['selected_days.0']
                                    }
                                    compact
                                />
                            )}
                        </FormSection>

                        <FormSection
                            eyebrow="Serviços"
                            title="Almoço e opções adicionais"
                        >
                            <OptionCards
                                legend="Almoço"
                                name="lunch_option"
                                options={registrationOptions.lunchOptions}
                                value={form.data.lunch_option}
                                onChange={(value) =>
                                    form.setData('lunch_option', value)
                                }
                                error={form.errors.lunch_option}
                            />
                            <SelectField
                                id="discount"
                                label="Desconto aplicável"
                                value={form.data.discount}
                                options={registrationOptions.discounts}
                                placeholder="Nenhum desconto"
                                onChange={(value) =>
                                    form.setData('discount', value)
                                }
                                error={form.errors.discount}
                            />
                            <BooleanCard
                                checked={form.data.needs_extended_care}
                                onChange={(checked) =>
                                    form.setData('needs_extended_care', checked)
                                }
                                title="Acolhimento ou prolongamento"
                                description="Preciso de acolhimento a partir das 8h e/ou prolongamento até às 18h30."
                            />
                        </FormSection>

                        <FormSection
                            eyebrow="Segurança"
                            title="Recolha e autorizações"
                        >
                            <TextField
                                id="authorized_pickup_name"
                                label="Pessoa autorizada a recolher"
                                value={form.data.authorized_pickup_name}
                                onChange={(value) =>
                                    form.setData(
                                        'authorized_pickup_name',
                                        value,
                                    )
                                }
                                error={form.errors.authorized_pickup_name}
                                required
                            />
                            <TextField
                                id="authorized_pickup_phone"
                                type="tel"
                                label="Contacto dessa pessoa"
                                value={form.data.authorized_pickup_phone}
                                onChange={(value) =>
                                    form.setData(
                                        'authorized_pickup_phone',
                                        value,
                                    )
                                }
                                error={form.errors.authorized_pickup_phone}
                                required
                            />
                            <BooleanCard
                                checked={form.data.trip_authorized}
                                onChange={(checked) =>
                                    form.setData('trip_authorized', checked)
                                }
                                title="Autorizo saídas e transporte"
                                description="Autorizo a participação nas atividades no exterior previstas no programa."
                            />
                            <OptionCards
                                legend="Autorização de imagem"
                                name="photo_consent"
                                options={registrationOptions.photoConsents}
                                value={form.data.photo_consent}
                                onChange={(value) =>
                                    form.setData('photo_consent', value)
                                }
                                error={form.errors.photo_consent}
                            />
                            <TextAreaField
                                id="notes"
                                label="Outras observações"
                                value={form.data.notes}
                                onChange={(value) =>
                                    form.setData('notes', value)
                                }
                                error={form.errors.notes}
                                className="sm:col-span-2"
                            />
                        </FormSection>

                        <section className="rounded-3xl border border-black/10 bg-white/90 p-5 shadow-lg sm:p-7">
                            <div className="space-y-3">
                                <ConsentField
                                    checked={form.data.privacy_accepted}
                                    onChange={(checked) =>
                                        form.setData(
                                            'privacy_accepted',
                                            checked,
                                        )
                                    }
                                    error={form.errors.privacy_accepted}
                                >
                                    Li e aceito a{' '}
                                    <Link
                                        href={privacyPolicy()}
                                        className="font-bold underline"
                                        target="_blank"
                                    >
                                        Política de Privacidade
                                    </Link>
                                    .
                                </ConsentField>
                                <ConsentField
                                    checked={form.data.terms_accepted}
                                    onChange={(checked) =>
                                        form.setData('terms_accepted', checked)
                                    }
                                    error={form.errors.terms_accepted}
                                >
                                    Li e aceito os{' '}
                                    <Link
                                        href={termsAndConditions()}
                                        className="font-bold underline"
                                        target="_blank"
                                    >
                                        Termos e Condições
                                    </Link>
                                    .
                                </ConsentField>
                            </div>

                            <div className="hidden" aria-hidden="true">
                                <label htmlFor="website">Website</label>
                                <input
                                    id="website"
                                    tabIndex={-1}
                                    autoComplete="off"
                                    value={form.data.website}
                                    onChange={(event) =>
                                        form.setData(
                                            'website',
                                            event.target.value,
                                        )
                                    }
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={form.processing}
                                className="mt-6 h-12 w-full rounded-xl bg-[#558b6e] text-base font-bold text-white hover:bg-[#376b50] sm:w-auto sm:px-8"
                            >
                                <CheckCircle2Icon aria-hidden="true" />
                                {form.processing
                                    ? 'A enviar…'
                                    : 'Enviar inscrição'}
                            </Button>
                        </section>
                    </form>
                </main>

                <PublicFooter />
            </div>
        </>
    );
}

function FormSection({
    eyebrow,
    title,
    children,
}: {
    eyebrow: string;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-3xl border border-black/10 bg-white/90 p-5 shadow-lg sm:p-7">
            <p className="text-xs font-bold tracking-wide text-[#376b50] uppercase">
                {eyebrow}
            </p>
            <h2 className="mt-1 text-xl font-black sm:text-2xl">{title}</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">{children}</div>
        </section>
    );
}

function TextField({
    id,
    label,
    description,
    value,
    onChange,
    error,
    type = 'text',
    required,
    autoComplete,
}: {
    id: string;
    label: string;
    description?: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    type?: string;
    required?: boolean;
    autoComplete?: string;
}) {
    return (
        <div>
            <Label htmlFor={id}>
                {label}
                {required && <span aria-hidden="true"> *</span>}
            </Label>
            <Input
                id={id}
                type={type}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                required={required}
                autoComplete={autoComplete}
                aria-invalid={Boolean(error)}
                aria-describedby={
                    [
                        description ? `${id}-description` : null,
                        error ? `${id}-error` : null,
                    ]
                        .filter(Boolean)
                        .join(' ') || undefined
                }
                className="mt-2 h-11 bg-white"
            />
            {description && (
                <p
                    id={`${id}-description`}
                    className="mt-1.5 text-xs text-gray-500"
                >
                    {description}
                </p>
            )}
            <FieldError id={`${id}-error`} error={error} />
        </div>
    );
}

function TextAreaField({
    id,
    label,
    description,
    value,
    onChange,
    error,
    className,
}: {
    id: string;
    label: string;
    description?: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    className?: string;
}) {
    return (
        <div className={className}>
            <Label htmlFor={id}>{label}</Label>
            {description && (
                <p className="mt-1 text-xs text-gray-500">{description}</p>
            )}
            <textarea
                id={id}
                rows={3}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${id}-error` : undefined}
                className="mt-2 w-full rounded-xl border border-input bg-white px-3 py-2 text-sm shadow-xs outline-none focus:border-[#558b6e] focus:ring-3 focus:ring-[#558b6e]/20"
            />
            <FieldError id={`${id}-error`} error={error} />
        </div>
    );
}

function ChoiceGrid({
    options,
    selected,
    onToggle,
    error,
    compact = false,
}: {
    options: (Option & { available?: boolean })[];
    selected: string[];
    onToggle: (value: string) => void;
    error?: string;
    compact?: boolean;
}) {
    return (
        <fieldset className="sm:col-span-2">
            <legend className="sr-only">Períodos pretendidos</legend>
            <div
                className={cn(
                    'grid gap-2',
                    compact ? 'grid-cols-2 sm:grid-cols-4' : 'sm:grid-cols-2',
                )}
            >
                {options.map((option) => {
                    const isAvailable = option.available !== false;

                    return (
                        <label
                            key={option.value}
                            className={cn(
                                'flex min-h-12 items-center gap-3 rounded-xl border px-3 py-2 text-sm font-semibold',
                                isAvailable
                                    ? 'cursor-pointer bg-white has-checked:border-[#558b6e] has-checked:bg-[#558b6e]/10'
                                    : 'cursor-not-allowed bg-gray-100 text-gray-400',
                            )}
                        >
                            <input
                                type="checkbox"
                                checked={selected.includes(option.value)}
                                onChange={() => onToggle(option.value)}
                                disabled={!isAvailable}
                                className="size-4 accent-[#558b6e]"
                            />
                            <span className="flex-1">{option.label}</span>
                            {!isAvailable && (
                                <span className="text-[0.65rem] font-bold uppercase">
                                    Esgotada
                                </span>
                            )}
                        </label>
                    );
                })}
            </div>
            <FieldError id="period-error" error={error} />
        </fieldset>
    );
}

function OptionCards({
    legend,
    name,
    options,
    value,
    onChange,
    error,
}: {
    legend: string;
    name: string;
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    error?: string;
}) {
    return (
        <fieldset className="sm:col-span-2">
            <legend className="text-sm font-medium">{legend}</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {options.map((option) => (
                    <label
                        key={option.value}
                        className="flex cursor-pointer items-center gap-3 rounded-xl border bg-white px-4 py-3 text-sm font-semibold has-checked:border-[#558b6e] has-checked:bg-[#558b6e]/10"
                    >
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={value === option.value}
                            onChange={() => onChange(option.value)}
                            className="size-4 accent-[#558b6e]"
                        />
                        {option.label}
                    </label>
                ))}
            </div>
            <FieldError id={`${name}-error`} error={error} />
        </fieldset>
    );
}

function SelectField({
    id,
    label,
    value,
    options,
    placeholder,
    onChange,
    error,
}: {
    id: string;
    label: string;
    value: string;
    options: Option[];
    placeholder: string;
    onChange: (value: string) => void;
    error?: string;
}) {
    return (
        <div className="sm:col-span-2">
            <Label htmlFor={id}>{label}</Label>
            <select
                id={id}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-input bg-white px-3 text-sm shadow-xs outline-none focus:border-[#558b6e] focus:ring-3 focus:ring-[#558b6e]/20"
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <FieldError id={`${id}-error`} error={error} />
        </div>
    );
}

function BooleanCard({
    checked,
    onChange,
    title,
    description,
}: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    title: string;
    description: string;
}) {
    return (
        <label className="flex cursor-pointer gap-3 rounded-xl border bg-white p-4 has-checked:border-[#558b6e] has-checked:bg-[#558b6e]/10 sm:col-span-2">
            <input
                type="checkbox"
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
                className="mt-0.5 size-4 accent-[#558b6e]"
            />
            <span>
                <span className="block text-sm font-bold">{title}</span>
                <span className="mt-1 block text-xs leading-5 text-gray-600">
                    {description}
                </span>
            </span>
        </label>
    );
}

function ConsentField({
    checked,
    onChange,
    error,
    children,
}: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label className="flex cursor-pointer items-start gap-3 text-sm">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(event) => onChange(event.target.checked)}
                    className="mt-0.5 size-4 accent-[#558b6e]"
                />
                <span>{children}</span>
            </label>
            <FieldError error={error} />
        </div>
    );
}

function FieldError({ id, error }: { id?: string; error?: string }) {
    if (!error) {
        return null;
    }

    return (
        <p id={id} className="mt-1.5 text-sm font-medium text-red-700">
            {error}
        </p>
    );
}

function toggleValue(values: string[], value: string): string[] {
    return values.includes(value)
        ? values.filter((item) => item !== value)
        : [...values, value];
}
