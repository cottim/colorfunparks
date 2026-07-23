import { Form } from '@inertiajs/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import React, { useReducer, useState } from 'react';
import { createBookingDateRange } from '@/components/book-party/booking-date-range';
import {
    bookingReducer,
    createInitialBookingData,
} from '@/components/book-party/booking-reducer';
import { validateBookingDetails } from '@/components/book-party/booking-validation';
import { DetailsStep } from '@/components/book-party/details-step';
import { ParkStep } from '@/components/book-party/park-step';
import { ReviewStep } from '@/components/book-party/review-step';
import type { Park } from '@/components/book-party/types';

type Step = 'park' | 'details' | 'review';

type BookPartyProps = {
    maxBookingMonthsAhead?: number;
};

const parks = [
    { value: 'color-party', label: 'Color Party' },
    { value: 'yupi-color', label: 'Yupi Color' },
    { value: 'kiddy-color', label: 'Kiddy Color' },
];

export function BookParty({ maxBookingMonthsAhead = 3 }: BookPartyProps) {
    const [step, setStep] = useState<Step>('park');

    const [data, dispatch] = useReducer(
        bookingReducer,
        undefined,
        createInitialBookingData,
    );

    const shouldReduceMotion = useReducedMotion();

    const partyDateRange = createBookingDateRange(maxBookingMonthsAhead);
    const validation = validateBookingDetails(data, partyDateRange);
    const [hasAttemptedContinue, setHasAttemptedContinue] = useState(false);

    function selectPark(park: Park) {
        dispatch({
            type: 'park.selected',
            park,
        });

        setStep('details');
    }

    function continueToReview() {
        setHasAttemptedContinue(true);

        if (!validation.isValid) {
            return;
        }

        setStep('review');
    }

    function submit() {
        console.log('Submitting:', data);
    }

    const animation = shouldReduceMotion
        ? {
              initial: { opacity: 1 },
              animate: { opacity: 1 },
              exit: { opacity: 1 },
          }
        : {
              initial: { opacity: 0, x: 24 },
              animate: { opacity: 1, x: 0 },
              exit: { opacity: 0, x: -24 },
          };

    return (
        <div className="flex w-full flex-col gap-8">
            <p className="text-sm font-medium text-gray-600" aria-live="polite">
                Passo {step === 'park' ? 1 : step === 'details' ? 2 : 3} de 3
            </p>

            <Form
                method="post"
                onSubmit={(event: React.SubmitEvent<HTMLFormElement>) =>
                    event.preventDefault()
                }
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.section
                        key={step}
                        initial={animation.initial}
                        animate={animation.animate}
                        exit={animation.exit}
                        transition={{ duration: 0.25 }}
                        className="flex flex-col gap-6"
                    >
                        {step === 'park' && (
                            <ParkStep parks={parks} onSelect={selectPark} />
                        )}

                        {step === 'details' && (
                            <DetailsStep
                                data={data}
                                partyDateRange={partyDateRange}
                                errors={validation.errors}
                                showValidationErrors={hasAttemptedContinue}
                                dispatch={dispatch}
                                onBack={() => setStep('park')}
                                onContinue={continueToReview}
                            />
                        )}

                        {step === 'review' && (
                            <ReviewStep
                                data={data}
                                onBack={() => setStep('details')}
                                onConfirm={submit}
                            />
                        )}
                    </motion.section>
                </AnimatePresence>
            </Form>
        </div>
    );
}
