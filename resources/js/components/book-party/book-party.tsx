import { useReducer, useState } from 'react';
import type { FormEvent } from 'react';
import { createBookingDateRange } from '@/components/book-party/booking-date-range';
import { parks, partyPrograms } from '@/components/book-party/booking-options';
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
import { ContactSection } from '@/components/book-party/contact-section';
import { DetailsSection } from '@/components/book-party/details-section';
import { ParkSection } from '@/components/book-party/park-section';
import { PartyChildFields } from '@/components/book-party/party-child-fields';
import { ProgramSection } from '@/components/book-party/program-section';
import type {
    BookingStep,
    ContactField,
    PartyChildField,
    PartyDetailsField,
} from '@/components/book-party/types';

type BookPartyProps = {
    maxBookingMonthsAhead?: number;
};

const bookingSteps: readonly BookingStep[] = [
    'contact',
    'park',
    'child',
    'details',
    'program',
];

export function BookParty({ maxBookingMonthsAhead = 3 }: BookPartyProps) {
    const [data, dispatch] = useReducer(
        bookingReducer,
        undefined,
        createInitialBookingData,
    );
    const [summaryData, summaryDispatch] = useReducer(
        bookingReducer,
        undefined,
        createInitialBookingData,
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

    const partyDateRange = createBookingDateRange(maxBookingMonthsAhead);
    const validation = validateBooking(data, partyDateRange);

    function showStepErrors(step: BookingStep): boolean {
        return hasAttemptedSubmit || attemptedSteps.has(step);
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
                ? [{ type: 'program.selected', program: data.program }]
                : [],
        };

        actions[step].forEach(summaryDispatch);
    }

    function continueFromStep(step: BookingStep) {
        setAttemptedSteps((currentSteps) => new Set(currentSteps).add(step));

        if (!isBookingStepValid(step, validation.errors)) {
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
                completedSteps.has(step) &&
                isBookingStepValid(step, validation.errors),
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

        dispatch(action);
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

        if (!validation.isValid) {
            const firstInvalidStep = bookingSteps.find(
                (step) => !isBookingStepValid(step, validation.errors),
            );

            if (firstInvalidStep) {
                setActiveStep(firstInvalidStep);
            }

            requestAnimationFrame(() => {
                document
                    .querySelector<HTMLElement>('[aria-invalid="true"]')
                    ?.focus();
            });
        }
    }

    return (
        <div className="grid gap-6">
            <BookingSummary data={summaryData} mobile />

            <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
                <form onSubmit={submit} noValidate className="grid gap-5">
                    <ContactSection
                        data={data}
                        errors={validation.errors}
                        showErrors={showStepErrors('contact')}
                        dispatch={dispatch}
                        workflow={sectionWorkflow('contact')}
                        onFieldBlur={commitContactField}
                    />

                    <ParkSection
                        parks={parks}
                        selectedPark={data.park}
                        error={
                            showStepErrors('park')
                                ? validation.errors.park
                                : undefined
                        }
                        onSelect={(park) => {
                            dispatch({
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
                        errors={validation.errors}
                        showValidationErrors={showStepErrors('child')}
                        onChange={(field, value) =>
                            dispatch({
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
                        errors={validation.errors}
                        showValidationErrors={showStepErrors('details')}
                        dispatch={dispatch}
                        onSelectionChange={changePartySelection}
                        onFieldBlur={commitPartyField}
                        workflow={sectionWorkflow('details')}
                    />

                    <ProgramSection
                        programs={partyPrograms}
                        selectedProgram={data.program}
                        error={
                            showStepErrors('program')
                                ? validation.errors.program
                                : undefined
                        }
                        onSelect={(program) => {
                            dispatch({
                                type: 'program.selected',
                                program,
                            });
                            summaryDispatch({
                                type: 'program.selected',
                                program,
                            });
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
                                className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-md bg-[#558b6e] px-6 text-sm font-semibold text-white shadow-md transition hover:bg-[#47775d] hover:shadow-lg focus-visible:ring-2 focus-visible:ring-[#558b6e] focus-visible:ring-offset-2 focus-visible:outline-none sm:w-auto"
                            >
                                Verificar dados
                            </button>
                            <p
                                role="status"
                                aria-live="polite"
                                className="mt-3 min-h-5 text-sm font-semibold text-[#35634b]"
                            >
                                {hasAttemptedSubmit &&
                                    validation.isValid &&
                                    'Todos os dados obrigatórios estão preenchidos.'}
                            </p>
                        </div>
                    )}
                </form>

                <BookingSummary data={summaryData} />
            </div>
        </div>
    );
}
