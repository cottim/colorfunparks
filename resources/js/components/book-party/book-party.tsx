import { Form } from '@inertiajs/react';
import { CalendarDaysIcon } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';
import { DetailsStep } from '@/components/book-party/details-step';
import { ParkStep } from '@/components/book-party/park-step';
import { ReviewStep } from '@/components/book-party/review-step';
import type {
    BookingData,
    Park,
    PartyChildField,
} from '@/components/book-party/types';
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

const parks = [
    { value: 'color-party', label: 'Color Party' },
    { value: 'yupi-color', label: 'Yupi Color' },
    { value: 'kiddy-color', label: 'Kiddy Color' },
];

export function BookParty() {
    const [step, setStep] = useState<Step>('park');

    const [data, setData] = useState<BookingData>(() => ({
        park: null,
        children: [
            {
                id: crypto.randomUUID(),
                name: '',
                birthDate: '',
            },
        ],
        email: '',
        guests: '',
    }));

    const headingRef = useRef<HTMLHeadingElement>(null);
    const shouldReduceMotion = useReducedMotion();

    const hasIncompleteChildren =
        data.children.length === 0 ||
        data.children.some(
            (child) => child.name.trim() === '' || child.birthDate === '',
        );

    const canContinueToReview =
        !hasIncompleteChildren &&
        data.email.trim() !== '' &&
        data.guests.trim() !== '';

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

    function updateChild(childId: string, key: PartyChildField, value: string) {
        setData((currentData) => ({
            ...currentData,
            children: currentData.children.map((child) =>
                child.id === childId
                    ? {
                          ...child,
                          [key]: value,
                      }
                    : child,
            ),
        }));
    }

    function selectPark(park: Park) {
        updateData('park', park);
        setStep('details');
    }

    function continueToReview() {
        if (!canContinueToReview) {
            return;
        }

        setStep('review');
    }

    function submit() {
        console.log('Submitting:', data);
    }

    function addChild() {
        setData((currentData) => ({
            ...currentData,
            children: [
                ...currentData.children,
                {
                    id: crypto.randomUUID(),
                    name: '',
                    birthDate: '',
                },
            ],
        }));
    }

    function removeChild(childId: string) {
        setData((currentData) => {
            if (currentData.children.length === 1) {
                return currentData;
            }

            return {
                ...currentData,
                children: currentData.children.filter(
                    (child) => child.id !== childId,
                ),
            };
        });
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
                                        headingRef={headingRef}
                                        onSelect={selectPark}
                                    />
                                )}

                                {step === 'details' && (
                                    <DetailsStep
                                        data={data}
                                        headingRef={headingRef}
                                        canContinue={canContinueToReview}
                                        onChildChange={updateChild}
                                        onAddChild={addChild}
                                        onRemoveChild={removeChild}
                                        onEmailChange={(email) =>
                                            updateData('email', email)
                                        }
                                        onGuestsChange={(guests) =>
                                            updateData('guests', guests)
                                        }
                                        onBack={() => setStep('park')}
                                        onContinue={continueToReview}
                                    />
                                )}

                                {step === 'review' && (
                                    <ReviewStep
                                        data={data}
                                        headingRef={headingRef}
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
