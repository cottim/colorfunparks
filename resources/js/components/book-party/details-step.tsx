import { addDays, addMonths, format, parseISO } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';
import type { Dispatch } from 'react';
import { useState } from 'react';
import { pt } from 'react-day-picker/locale';
import type { BookingAction } from '@/components/book-party/booking-reducer';
import type { BookingDetailsErrors } from '@/components/book-party/booking-validation';
import { createPartyChild } from '@/components/book-party/party-child';
import { PartyChildFields } from '@/components/book-party/party-child-fields';
import { StepHeading } from '@/components/book-party/step-heading';
import type {
    BookingData,
    PartyChildField,
} from '@/components/book-party/types';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

type DetailsStepProps = {
    data: BookingData;
    maxBookingMonthsAhead: number;
    errors: BookingDetailsErrors;
    showValidationErrors: boolean;
    dispatch: Dispatch<BookingAction>;
    onBack: () => void;
    onContinue: () => void;
};

export function DetailsStep({
    data,
    maxBookingMonthsAhead,
    errors,
    showValidationErrors,
    dispatch,
    onBack,
    onContinue,
}: DetailsStepProps) {
    const [touchedFields, setTouchedFields] = useState({
        email: false,
        guests: false,
        partyDate: false,
    });

    const [isPartyDateOpen, setIsPartyDateOpen] = useState(false);

    const fallbackPartyDate = addDays(new Date(), 6);
    const partyDate = data.partyDate ? parseISO(data.partyDate) : undefined;

    const emailError =
        touchedFields.email || showValidationErrors ? errors.email : undefined;

    const guestsError =
        touchedFields.guests || showValidationErrors
            ? errors.guests
            : undefined;

    const partyDateError =
        touchedFields.partyDate || showValidationErrors
            ? errors.partyDate
            : undefined;

    return (
        <>
            <div>
                <StepHeading>Detalhes da festa</StepHeading>

                <p>Parque seleccionado: {data.park?.label ?? '-'}</p>
            </div>

            {data.children.map((child) => (
                <PartyChildFields
                    key={child.id}
                    child={child}
                    showValidationErrors={showValidationErrors}
                    canRemove={data.children.length > 1}
                    onChange={(childId, key: PartyChildField, value) =>
                        dispatch({
                            type: 'child.changed',
                            childId,
                            field: key,
                            value,
                        })
                    }
                    onRemove={(childId) =>
                        dispatch({
                            type: 'child.removed',
                            childId,
                        })
                    }
                />
            ))}

            <Button
                type="button"
                variant="secondary"
                className="self-start"
                onClick={() =>
                    dispatch({
                        type: 'child.added',
                        child: createPartyChild(),
                    })
                }
            >
                Adicionar outra criança
            </Button>

            <Field>
                <Label htmlFor="booking-email">Email</Label>
                <Input
                    type="email"
                    id="booking-email"
                    name="booking-email"
                    value={data.email}
                    onChange={(event) =>
                        dispatch({
                            type: 'email.changed',
                            value: event.target.value,
                        })
                    }
                    onBlur={() =>
                        setTouchedFields((current) => ({
                            ...current,
                            email: true,
                        }))
                    }
                    aria-invalid={Boolean(emailError)}
                    aria-describedby={
                        emailError ? 'booking-email-error' : undefined
                    }
                    className="rounded-md border p-2"
                    required
                />
                <InputError id="booking-email-error" message={emailError} />
            </Field>
            <Field>
                <Label htmlFor="booking-party-date">Data de nascimento</Label>
                <Popover
                    open={isPartyDateOpen}
                    onOpenChange={(isOpen) => {
                        setIsPartyDateOpen(isOpen);

                        if (!isOpen) {
                            setTouchedFields((current) => ({
                                ...current,
                                partyDate: true,
                            }));
                        }
                    }}
                >
                    <PopoverTrigger asChild>
                        <Button
                            type="button"
                            id="booking-party-date"
                            name="booking-party-date"
                            variant="outline"
                            data-empty={addDays(new Date(), 7)}
                            aria-invalid={Boolean(partyDateError)}
                            aria-describedby={
                                partyDateError ? partyDateError : undefined
                            }
                            className="justify-between bg-transparent text-left font-normal hover:bg-white/40 data-[empty=true]:text-muted-foreground dark:bg-transparent dark:hover:bg-white/40"
                        >
                            {data.partyDate ? (
                                format(data.partyDate, 'yyyy-MM-dd')
                            ) : (
                                <span>Data da Festa</span>
                            )}
                            <ChevronDownIcon />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            locale={pt}
                            mode="single"
                            selected={partyDate}
                            defaultMonth={partyDate ?? fallbackPartyDate}
                            startMonth={new Date()}
                            endMonth={addMonths(
                                new Date(),
                                maxBookingMonthsAhead,
                            )}
                            captionLayout="label"
                            reverseYears
                            onSelect={(date) => {
                                if (!date) {
                                    return;
                                }

                                dispatch({
                                    type: 'partyDate.changed',
                                    value: format(date, 'yyyy-MM-dd'),
                                });

                                setTouchedFields((current) => ({
                                    ...current,
                                    birthDate: true,
                                }));

                                setIsPartyDateOpen(false);
                            }}
                        />
                    </PopoverContent>
                </Popover>
                <InputError
                    id="booking-party-date-error"
                    message={partyDateError}
                />
            </Field>
            <Field>
                <Label htmlFor="booking-guests">Número de convidados</Label>
                <Input
                    id="booking-guests"
                    name="booking-guests"
                    type="number"
                    min="10"
                    max="100"
                    value={data.guests}
                    onChange={(event) =>
                        dispatch({
                            type: 'guests.changed',
                            value: event.target.value,
                        })
                    }
                    onBlur={() =>
                        setTouchedFields((current) => ({
                            ...current,
                            guests: true,
                        }))
                    }
                    aria-invalid={Boolean(guestsError)}
                    aria-describedby={
                        guestsError ? 'booking-guests-error' : undefined
                    }
                    className="rounded-md border p-2"
                    required
                />
                <InputError id="booking-guests-error" message={guestsError} />
            </Field>

            <div className="flex gap-3">
                <Button variant="secondary" type="button" onClick={onBack}>
                    Voltar
                </Button>

                <Button type="button" onClick={onContinue}>
                    Próximo passo
                </Button>
            </div>
        </>
    );
}
