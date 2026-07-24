import { Link } from '@inertiajs/react';
import type { Dispatch } from 'react';
import type { BookingAction } from '@/components/book-party/booking-reducer';
import { BookingSection } from '@/components/book-party/booking-section';
import type { BookingSectionWorkflow } from '@/components/book-party/booking-section';
import type { BookingErrors } from '@/components/book-party/booking-validation';
import type { BookingData, ContactField } from '@/components/book-party/types';
import InputError from '@/components/input-error';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { privacyPolicy, termsAndConditions } from '@/routes/legal';

type ContactSectionProps = {
    data: BookingData;
    errors: BookingErrors;
    showErrors: boolean;
    dispatch: Dispatch<BookingAction>;
    workflow: BookingSectionWorkflow;
    onFieldBlur: (field: ContactField, value: string | boolean) => void;
};

export function ContactSection({
    data,
    errors,
    showErrors,
    dispatch,
    workflow,
    onFieldBlur,
}: ContactSectionProps) {
    function changeContact(field: ContactField, value: string | boolean) {
        dispatch({
            type: 'contact.changed',
            field,
            value,
        });
    }

    return (
        <BookingSection
            number={1}
            title="Os teus dados"
            description="Precisamos de uma forma de contacto para acompanhar o pedido."
            workflow={workflow}
        >
            <div className="grid gap-5 sm:grid-cols-2">
                <Field className="sm:col-span-2">
                    <Label htmlFor="booking-contact-name">Nome</Label>
                    <Input
                        id="booking-contact-name"
                        name="contact_name"
                        value={data.contact.name}
                        onChange={(event) =>
                            changeContact('name', event.target.value)
                        }
                        onBlur={(event) =>
                            onFieldBlur('name', event.target.value)
                        }
                        autoComplete="name"
                        required
                        aria-invalid={showErrors && Boolean(errors.contactName)}
                    />
                    <InputError
                        message={showErrors ? errors.contactName : undefined}
                    />
                </Field>

                <Field>
                    <Label htmlFor="booking-contact-email">
                        Email{' '}
                        <span className="text-gray-500">(preferencial)</span>
                    </Label>
                    <Input
                        id="booking-contact-email"
                        name="email"
                        type="email"
                        value={data.contact.email}
                        onChange={(event) =>
                            changeContact('email', event.target.value)
                        }
                        onBlur={(event) =>
                            onFieldBlur('email', event.target.value)
                        }
                        autoComplete="email"
                        inputMode="email"
                        placeholder="nome@exemplo.pt"
                        aria-invalid={
                            showErrors &&
                            Boolean(errors.email || errors.contactMethod)
                        }
                    />
                    <InputError
                        message={showErrors ? errors.email : undefined}
                    />
                </Field>

                <Field>
                    <Label htmlFor="booking-contact-phone">Telefone</Label>
                    <Input
                        id="booking-contact-phone"
                        name="phone"
                        type="tel"
                        value={data.contact.phone}
                        onChange={(event) =>
                            changeContact('phone', event.target.value)
                        }
                        onBlur={(event) =>
                            onFieldBlur('phone', event.target.value)
                        }
                        autoComplete="tel"
                        inputMode="tel"
                        placeholder="+351 912 345 678"
                        aria-invalid={
                            showErrors &&
                            Boolean(errors.phone || errors.contactMethod)
                        }
                    />
                    <InputError
                        message={showErrors ? errors.phone : undefined}
                    />
                </Field>
            </div>

            <p className="mt-3 text-sm text-gray-500">
                Preenche pelo menos um dos contactos: email ou telefone.
            </p>
            <InputError
                className="mt-3"
                message={showErrors ? errors.contactMethod : undefined}
            />

            <div className="mt-6 grid gap-4 border-t border-black/10 pt-6">
                <ConsentField
                    id="booking-privacy"
                    name="privacy_accepted"
                    checked={data.contact.privacyAccepted}
                    onChange={(checked) =>
                        changeContact('privacyAccepted', checked)
                    }
                    error={showErrors ? errors.privacyAccepted : undefined}
                >
                    Li e aceito a{' '}
                    <Link
                        href={privacyPolicy()}
                        className="font-semibold underline underline-offset-4"
                    >
                        Política de Privacidade
                    </Link>{' '}
                    para o tratamento dos dados deste pedido.
                </ConsentField>

                <ConsentField
                    id="booking-terms"
                    name="terms_accepted"
                    checked={data.contact.termsAccepted}
                    onChange={(checked) =>
                        changeContact('termsAccepted', checked)
                    }
                    error={showErrors ? errors.termsAccepted : undefined}
                >
                    Li e aceito os{' '}
                    <Link
                        href={termsAndConditions()}
                        className="font-semibold underline underline-offset-4"
                    >
                        Termos e Condições
                    </Link>
                    .
                </ConsentField>

                <ConsentField
                    id="booking-marketing"
                    name="marketing_accepted"
                    checked={data.contact.marketingAccepted}
                    onChange={(checked) =>
                        changeContact('marketingAccepted', checked)
                    }
                >
                    Quero receber campanhas e novidades da Color Fun Parks.
                    <span className="ml-1 text-gray-500">(Opcional)</span>
                </ConsentField>
            </div>
        </BookingSection>
    );
}

type ConsentFieldProps = {
    id: string;
    name: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    error?: string;
    children: React.ReactNode;
};

function ConsentField({
    id,
    name,
    checked,
    onChange,
    error,
    children,
}: ConsentFieldProps) {
    return (
        <div className="grid gap-2">
            <div className="flex items-start gap-3">
                <input
                    id={id}
                    name={name}
                    type="checkbox"
                    checked={checked}
                    onChange={(event) => onChange(event.target.checked)}
                    aria-invalid={Boolean(error)}
                    className="mt-1 size-4 shrink-0 accent-[#558b6e]"
                />
                <Label
                    htmlFor={id}
                    className="block text-sm leading-6 font-normal"
                >
                    {children}
                </Label>
            </div>
            <InputError message={error} />
        </div>
    );
}
