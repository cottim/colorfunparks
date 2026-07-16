import { Form } from '@inertiajs/react';
import { CalendarDaysIcon } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';
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

type BookingData = {
    park: string;
    childName: string;
    email: string;
    guests: string;
};
const parks = [
    { value: 'color-party', label: 'Color Party' },
    { value: 'yupi-color', label: 'Yupi Color' },
    { value: 'kiddy-color', label: 'Kiddy Color' },
];


export function BookParty() {
    const [step, setStep] = useState<Step>('park');

    const [data, setData] = useState<BookingData>({
        park: '',
        childName: '',
        email: '',
        guests: '',
    });

    const headingRef = useRef<HTMLHeadingElement>(null);
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        headingRef.current?.focus();
    }, [step]);

    function updateData<Key extends keyof BookingData>(
        key: Key,
        value: BookingData[Key],
    ) {
        setData((currentData) => ({
            ...currentData,
            [key]: value,
        }));
    }

    function selectPark(park: string) {
        updateData('park', park);
        setStep('details');
    }

    function continueToReview() {
        if (!data.childName || !data.email || !data.guests) {
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
            <SheetTrigger>
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
                                    <>
                                        <h2 ref={headingRef} tabIndex={-1}>
                                            Choose your park
                                        </h2>

                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                            {parks.map((park) => (
                                                <button
                                                    key={park.value}
                                                    type="button"
                                                    className="rounded-xl border p-6 transition hover:-translate-y-1 hover:shadow-lg focus-visible:ring-2"
                                                    onClick={() =>
                                                        selectPark(park.value)
                                                    }
                                                >
                                                    {park.label}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {step === 'details' && (
                                    <>
                                        <div>
                                            <h2 ref={headingRef} tabIndex={-1}>
                                                Party details
                                            </h2>

                                            <p>Selected park: {data.park}</p>
                                        </div>

                                        <label className="flex flex-col gap-2">
                                            Child’s name
                                            <input
                                                value={data.childName}
                                                onChange={(event) =>
                                                    updateData(
                                                        'childName',
                                                        event.target.value,
                                                    )
                                                }
                                                className="rounded-md border p-2"
                                            />
                                        </label>

                                        <label className="flex flex-col gap-2">
                                            Contact email
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(event) =>
                                                    updateData(
                                                        'email',
                                                        event.target.value,
                                                    )
                                                }
                                                className="rounded-md border p-2"
                                            />
                                        </label>

                                        <label className="flex flex-col gap-2">
                                            Number of guests
                                            <input
                                                type="number"
                                                min="1"
                                                value={data.guests}
                                                onChange={(event) =>
                                                    updateData(
                                                        'guests',
                                                        event.target.value,
                                                    )
                                                }
                                                className="rounded-md border p-2"
                                            />
                                        </label>

                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setStep('park')}
                                            >
                                                Back
                                            </button>

                                            <button
                                                type="button"
                                                disabled={
                                                    !data.childName ||
                                                    !data.email ||
                                                    !data.guests
                                                }
                                                onClick={continueToReview}
                                            >
                                                Continue
                                            </button>
                                        </div>
                                    </>
                                )}

                                {step === 'review' && (
                                    <>
                                        <h2 ref={headingRef} tabIndex={-1}>
                                            Check your booking
                                        </h2>

                                        <dl className="grid grid-cols-2 gap-3">
                                            <dt>Park</dt>
                                            <dd>{data.park}</dd>

                                            <dt>Child</dt>
                                            <dd>{data.childName}</dd>

                                            <dt>Email</dt>
                                            <dd>{data.email}</dd>

                                            <dt>Guests</dt>
                                            <dd>{data.guests}</dd>
                                        </dl>

                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setStep('details')
                                                }
                                            >
                                                Back
                                            </button>

                                            <button
                                                type="button"
                                                onClick={submit}
                                            >
                                                Confirm booking
                                            </button>
                                        </div>
                                    </>
                                )}
                            </motion.section>
                        </AnimatePresence>
                    </Form>
                </div>
            </SheetContent>
        </Sheet>
    );
}
