import { Form } from '@inertiajs/react';
import { CalendarDaysIcon } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import React, { useReducer, useState } from 'react';
import {
    bookingReducer,
    createInitialBookingData,
} from '@/components/book-party/booking-reducer';
import { validateBookingDetails } from '@/components/book-party/booking-validation';
import { DetailsStep } from '@/components/book-party/details-step';
import { ParkStep } from '@/components/book-party/park-step';
import { ReviewStep } from '@/components/book-party/review-step';
import type { Park } from '@/components/book-party/types';
import { CtaButton } from '@/components/ui/cta-button';
import { Separator } from '@/components/ui/separator';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

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

    const validation = validateBookingDetails(data, maxBookingMonthsAhead);
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
        <Sheet>
            <SheetTrigger asChild>
                <CtaButton attention="shine">
                    <CalendarDaysIcon />
                    Agendar Festa
                </CtaButton>
            </SheetTrigger>
            <SheetContent className="w-11/12 min-w-84 bg-linear-to-b from-[#FFFE00] to-[#FFCD00] p-4 text-gray-900 sm:max-w-5xl">
                <SheetHeader className="p-2">
                    <SheetTitle className="text-gray-900">
                        Marcar Festa
                    </SheetTitle>
                    <SheetDescription className="text-gray-900">
                        Por favor preencha os dados da sua festa de acordo com o
                        que pretende.
                    </SheetDescription>
                </SheetHeader>
                <Separator></Separator>
                <div className="flex w-full flex-col gap-8 px-2 py-8">
                    <p className="mb-4 text-sm" aria-live="polite">
                        Passo {step === 'park' ? 1 : step === 'details' ? 2 : 3}{' '}
                        de 3
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
                                    <ParkStep
                                        parks={parks}
                                        onSelect={selectPark}
                                    />
                                )}

                                {step === 'details' && (
                                    <DetailsStep
                                        data={data}
                                        maxBookingMonthsAhead={
                                            maxBookingMonthsAhead
                                        }
                                        errors={validation.errors}
                                        showValidationErrors={
                                            hasAttemptedContinue
                                        }
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
                                    ></ReviewStep>
                                )}
                            </motion.section>
                        </AnimatePresence>
                    </Form>
                </div>
            </SheetContent>
        </Sheet>
    );
}
