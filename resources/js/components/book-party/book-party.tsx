import { useForm } from '@inertiajs/react';
import { useReducer, useState } from 'react';
import type { FormEvent } from 'react';
import { createBookingDateRange } from '@/components/book-party/booking-date-range';
import {
    bookingReducer,
    createInitialBookingData,
} from '@/components/book-party/booking-reducer';
import type { BookingAction } from '@/components/book-party/booking-reducer';
import type { BookingSectionWorkflow } from '@/components/book-party/booking-section';
import { BookingSummary } from '@/components/book-party/booking-summary';
import {
    isBookingStepValid,
    validateBooking,
} from '@/components/book-party/booking-validation';
import type { BookingErrors } from '@/components/book-party/booking-validation';
import { ContactSection } from '@/components/book-party/contact-section';
import { DetailsSection } from '@/components/book-party/details-section';
import { ParkSection } from '@/components/book-party/park-section';
import { PartyChildFields } from '@/components/book-party/party-child-fields';
import { ProgramSection } from '@/components/book-party/program-section';
import type {
    BookingStep,
    BookingOptions,
    AuthenticatedCustomer,
    ContactField,
    PartyChildField,
    PartyBookingPayload,
    PartyDetailsField,
    PartyProgramSelection,
} from '@/components/book-party/types';
import { store as storePartyBooking } from '@/routes/party-bookings';

type BookPartyProps = {
    bookingOptions: BookingOptions;
    initialProgramSelection?: PartyProgramSelection | null;
    authenticatedCustomer?: AuthenticatedCustomer | null;
};

const bookingSteps: readonly BookingStep[] = [
    'contact',
    'park',
    'child',
    'details',
    'program',
];

export function BookParty({
    bookingOptions,
    initialProgramSelection,
    authenticatedCustomer = null,
}: BookPartyProps) {
    const initialProgram =
        bookingOptions.programs.find(
            (program) =>
                program.value === initialProgramSelection?.programValue,
        ) ?? null;
    const initialBookingData = createInitialBookingData(
        initialProgram,
        initialProgram ? (initialProgramSelection?.choices ?? {}) : {},
        authenticatedCustomer,
    );
    const [data, dispatch] = useReducer(bookingReducer, initialBookingData);
    const [summaryData, summaryDispatch] = useReducer(
        bookingReducer,
        initialBookingData,
    );
    const [activeStep, setActiveStep] = useState<BookingStep | null>('contact');
    const [highestUnlockedStepIndex, setHighestUnlockedStepIndex] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<Set<BookingStep>>(
        new Set(),
    );
    const [attemptedSteps, setAttemptedSteps] = useState<Set<BookingStep>>(
        new Set(),
    );
    const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
    const bookingForm = useForm<PartyBookingPayload>(
        createPartyBookingPayload(initialBookingData),
    );

    const partyDateRange = createBookingDateRange(
        bookingOptions.maxBookingMonthsAhead,
    );
    const clientValidation = validateBooking(
        data,
        partyDateRange,
        bookingOptions.partyTimes,
    );
    const errors = {
        ...clientValidation.errors,
        ...mapServerErrors(bookingForm.errors),
    };

    function showStepErrors(step: BookingStep): boolean {
        return (
            hasAttemptedSubmit ||
            attemptedSteps.has(step) ||
            bookingForm.hasErrors
        );
    }

    function commitStep(step: BookingStep) {
        const actions: Record<BookingStep, BookingAction[]> = {
            contact: [
                {
                    type: 'contact.changed',
                    field: 'name',
                    value: data.contact.name,
                },
                {
                    type: 'contact.changed',
                    field: 'email',
                    value: data.contact.email,
                },
                {
                    type: 'contact.changed',
                    field: 'phone',
                    value: data.contact.phone,
                },
                {
                    type: 'contact.changed',
                    field: 'privacyAccepted',
                    value: data.contact.privacyAccepted,
                },
                {
                    type: 'contact.changed',
                    field: 'termsAccepted',
                    value: data.contact.termsAccepted,
                },
                {
                    type: 'contact.changed',
                    field: 'marketingAccepted',
                    value: data.contact.marketingAccepted,
                },
            ],
            park: data.park ? [{ type: 'park.selected', park: data.park }] : [],
            child: [
                {
                    type: 'child.changed',
                    field: 'name',
                    value: data.child.name,
                },
                {
                    type: 'child.changed',
                    field: 'age',
                    value: data.child.age,
                },
            ],
            details: [
                {
                    type: 'party.changed',
                    field: 'partyDate',
                    value: data.partyDate,
                },
                {
                    type: 'party.changed',
                    field: 'partyTime',
                    value: data.partyTime,
                },
                {
                    type: 'party.changed',
                    field: 'guests',
                    value: data.guests,
                },
            ],
            program: data.program
                ? [
                      { type: 'program.selected', program: data.program },
                      ...Object.entries(data.programChoices).map(
                          ([group, choice]): BookingAction => ({
                              type: 'program.choice.selected',
                              group,
                              choice,
                          }),
                      ),
                  ]
                : [],
        };

        actions[step].forEach(summaryDispatch);
    }

    function changeBooking(action: BookingAction) {
        dispatch(action);

        const errorFields = bookingActionErrorFields(action);

        if (errorFields.length > 0) {
            bookingForm.clearErrors(...errorFields);
        }
    }

    function continueFromStep(step: BookingStep) {
        setAttemptedSteps((currentSteps) => new Set(currentSteps).add(step));

        if (!isBookingStepValid(step, errors)) {
            requestAnimationFrame(() => {
                const stepNumber = bookingSteps.indexOf(step) + 1;

                document
                    .querySelector<HTMLElement>(
                        `#booking-step-${stepNumber}-content [aria-invalid="true"]`,
                    )
                    ?.focus();
            });

            return;
        }

        commitStep(step);
        setCompletedSteps((currentSteps) => new Set(currentSteps).add(step));

        const currentStepIndex = bookingSteps.indexOf(step);
        const nextStep = bookingSteps[currentStepIndex + 1];

        if (!nextStep) {
            setActiveStep(null);

            requestAnimationFrame(() => {
                document.querySelector<HTMLElement>('#booking-submit')?.focus();
            });

            return;
        }

        setHighestUnlockedStepIndex((currentIndex) =>
            Math.max(currentIndex, currentStepIndex + 1),
        );
        setActiveStep(nextStep);

        requestAnimationFrame(() => {
            document
                .querySelector<HTMLElement>(
                    `#booking-step-${currentStepIndex + 2}-heading`,
                )
                ?.focus();
        });
    }

    function sectionWorkflow(
        step: BookingStep,
        continueLabel?: string,
    ): BookingSectionWorkflow {
        const stepIndex = bookingSteps.indexOf(step);

        return {
            isOpen: activeStep === step,
            isLocked: stepIndex > highestUnlockedStepIndex,
            isComplete:
                completedSteps.has(step) && isBookingStepValid(step, errors),
            onToggle: () =>
                setActiveStep((currentStep) =>
                    currentStep === step ? null : step,
                ),
            onContinue: () => continueFromStep(step),
            continueLabel,
        };
    }

    function commitContactField(field: ContactField, value: string | boolean) {
        summaryDispatch({
            type: 'contact.changed',
            field,
            value,
        });
    }

    function commitChildField(field: PartyChildField, value: string) {
        summaryDispatch({
            type: 'child.changed',
            field,
            value,
        });
    }

    function changePartySelection(field: PartyDetailsField, value: string) {
        const action: BookingAction = {
            type: 'party.changed',
            field,
            value,
        };

        changeBooking(action);
        summaryDispatch(action);
    }

    function commitPartyField(field: PartyDetailsField, value: string) {
        summaryDispatch({
            type: 'party.changed',
            field,
            value,
        });
    }

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setHasAttemptedSubmit(true);

        if (!clientValidation.isValid) {
            const firstInvalidStep = bookingSteps.find(
                (step) => !isBookingStepValid(step, clientValidation.errors),
            );

            if (firstInvalidStep) {
                setActiveStep(firstInvalidStep);
            }

            requestAnimationFrame(() => {
                document
                    .querySelector<HTMLElement>('[aria-invalid="true"]')
                    ?.focus();
            });

            return;
        }

        bookingForm.transform(() =>
            createPartyBookingPayload(data, bookingForm.data.website),
        );
        bookingForm.submit(storePartyBooking(), {
            onError: (serverErrors: Record<string, string>) => {
                const mappedErrors = mapServerErrors(serverErrors);
                const firstInvalidStep = bookingSteps.find(
                    (step) => !isBookingStepValid(step, mappedErrors),
                );

                if (firstInvalidStep) {
                    setActiveStep(firstInvalidStep);
                }

                requestAnimationFrame(() => {
                    document
                        .querySelector<HTMLElement>('[aria-invalid="true"]')
                        ?.focus();
                });
            },
        });
    }

    return (
        <div className="grid gap-6">
            <BookingSummary data={summaryData} mobile />

            <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
                <form onSubmit={submit} noValidate className="grid gap-5">
                    <ContactSection
                        data={data}
                        authenticatedCustomer={authenticatedCustomer}
                        errors={errors}
                        showErrors={showStepErrors('contact')}
                        dispatch={changeBooking}
                        workflow={sectionWorkflow('contact')}
                        onFieldBlur={commitContactField}
                    />

                    <ParkSection
                        parks={bookingOptions.parks}
                        selectedPark={data.park}
                        error={showStepErrors('park') ? errors.park : undefined}
                        onSelect={(park) => {
                            changeBooking({
                                type: 'park.selected',
                                park,
                            });
                            summaryDispatch({
                                type: 'park.selected',
                                park,
                            });
                        }}
                        workflow={sectionWorkflow('park')}
                    />

                    <PartyChildFields
                        child={data.child}
                        errors={errors}
                        showValidationErrors={showStepErrors('child')}
                        onChange={(field, value) =>
                            changeBooking({
                                type: 'child.changed',
                                field,
                                value,
                            })
                        }
                        onFieldBlur={commitChildField}
                        workflow={sectionWorkflow('child')}
                    />

                    <DetailsSection
                        data={data}
                        partyDateRange={partyDateRange}
                        partyTimes={bookingOptions.partyTimes}
                        errors={errors}
                        showValidationErrors={showStepErrors('details')}
                        dispatch={changeBooking}
                        onSelectionChange={changePartySelection}
                        onFieldBlur={commitPartyField}
                        workflow={sectionWorkflow('details')}
                    />

                    <ProgramSection
                        programs={bookingOptions.programs}
                        selectedProgram={data.program}
                        selectedChoices={data.programChoices}
                        error={
                            showStepErrors('program')
                                ? errors.program
                                : undefined
                        }
                        choiceError={
                            showStepErrors('program')
                                ? errors.programChoices
                                : undefined
                        }
                        onSelect={(program) => {
                            changeBooking({
                                type: 'program.selected',
                                program,
                            });
                            summaryDispatch({
                                type: 'program.selected',
                                program,
                            });
                        }}
                        onChoiceSelect={(group, choice) => {
                            const action: BookingAction = {
                                type: 'program.choice.selected',
                                group,
                                choice,
                            };

                            changeBooking(action);
                            summaryDispatch(action);
                        }}
                        workflow={sectionWorkflow('program', 'Rever pedido')}
                    />

                    {completedSteps.size === bookingSteps.length && (
                        <div className="rounded-2xl border border-[#558b6e]/40 bg-[#558b6e]/10 p-5 shadow-sm sm:p-6">
                            <h2 className="text-lg font-bold text-gray-900">
                                Pedido pronto para rever
                            </h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                Confirma o resumo antes de avançarmos para o
                                envio do pedido.
                            </p>
                            <button
                                id="booking-submit"
                                type="submit"
                                disabled={bookingForm.processing}
                                className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-md bg-[#558b6e] px-6 text-sm font-semibold text-white shadow-md transition hover:bg-[#47775d] hover:shadow-lg focus-visible:ring-2 focus-visible:ring-[#558b6e] focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60 sm:w-auto"
                            >
                                {bookingForm.processing
                                    ? 'A enviar pedido…'
                                    : 'Confirmar e enviar pedido'}
                            </button>
                            <p
                                role="status"
                                aria-live="polite"
                                className="mt-3 min-h-5 text-sm font-semibold text-[#35634b]"
                            >
                                {bookingForm.hasErrors &&
                                    'Não foi possível enviar. Revê os campos assinalados.'}
                            </p>
                            <input
                                type="text"
                                name="website"
                                value={bookingForm.data.website}
                                onChange={(event) =>
                                    bookingForm.setData(
                                        'website',
                                        event.target.value,
                                    )
                                }
                                tabIndex={-1}
                                autoComplete="off"
                                className="hidden"
                                aria-hidden="true"
                            />
                        </div>
                    )}
                </form>

                <BookingSummary data={summaryData} />
            </div>
        </div>
    );
}

function createPartyBookingPayload(
    data: ReturnType<typeof createInitialBookingData>,
    website = '',
): PartyBookingPayload {
    return {
        contact_name: data.contact.name,
        email: data.contact.email,
        phone: data.contact.phone,
        privacy_accepted: data.contact.privacyAccepted,
        terms_accepted: data.contact.termsAccepted,
        marketing_accepted: data.contact.marketingAccepted,
        park: data.park?.value ?? '',
        child_name: data.child.name,
        child_age: data.child.age,
        party_date: data.partyDate,
        party_time: data.partyTime,
        guests: data.guests,
        program: data.program?.value ?? '',
        program_choices: data.programChoices,
        website,
    };
}

function mapServerErrors(serverErrors: Record<string, string>): BookingErrors {
    const fieldMap: Record<string, keyof BookingErrors> = {
        contact_name: 'contactName',
        email: 'email',
        phone: 'phone',
        privacy_accepted: 'privacyAccepted',
        terms_accepted: 'termsAccepted',
        marketing_accepted: 'marketingAccepted',
        park: 'park',
        child_name: 'name',
        child_age: 'age',
        party_date: 'partyDate',
        party_time: 'partyTime',
        guests: 'guests',
        program: 'program',
        website: 'contactMethod',
    };

    return Object.entries(serverErrors).reduce<BookingErrors>(
        (mappedErrors, [field, message]) => {
            if (field.startsWith('program_choices')) {
                mappedErrors.programChoices = message;

                return mappedErrors;
            }

            const mappedField = fieldMap[field];

            if (mappedField) {
                mappedErrors[mappedField] = message;
            }

            return mappedErrors;
        },
        {},
    );
}

function bookingActionErrorFields(
    action: BookingAction,
): (keyof PartyBookingPayload)[] {
    switch (action.type) {
        case 'park.selected':
            return ['park'];
        case 'program.selected':
            return ['program', 'program_choices'];
        case 'program.choice.selected':
            return ['program_choices'];
        case 'child.changed':
            return [action.field === 'name' ? 'child_name' : 'child_age'];
        case 'party.changed':
            return [
                action.field === 'partyDate'
                    ? 'party_date'
                    : action.field === 'partyTime'
                      ? 'party_time'
                      : 'guests',
            ];
        case 'contact.changed':
            switch (action.field) {
                case 'name':
                    return ['contact_name'];
                case 'email':
                case 'phone':
                    return ['email', 'phone'];
                case 'privacyAccepted':
                    return ['privacy_accepted'];
                case 'termsAccepted':
                    return ['terms_accepted'];
                case 'marketingAccepted':
                    return ['marketing_accepted', 'email'];
            }
    }
}
