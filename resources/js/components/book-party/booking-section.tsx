import { CheckIcon, ChevronDownIcon, LockIcon } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type BookingSectionWorkflow = {
    isOpen: boolean;
    isLocked: boolean;
    isComplete: boolean;
    onToggle: () => void;
    onContinue: () => void;
    continueLabel?: string;
};

type BookingSectionProps = ComponentProps<'section'> & {
    number: number;
    title: string;
    description: string;
    children: ReactNode;
    workflow: BookingSectionWorkflow;
};

export function BookingSection({
    number,
    title,
    description,
    children,
    workflow,
    className,
    ...props
}: BookingSectionProps) {
    const headingId = `booking-step-${number}-heading`;
    const contentId = `booking-step-${number}-content`;

    return (
        <section
            className={cn(
                'rounded-2xl border bg-white shadow-sm transition-colors',
                workflow.isOpen ? 'border-[#558b6e]/50' : 'border-black/10',
                workflow.isLocked && 'bg-white/60',
                className,
            )}
            {...props}
        >
            <h2 className="text-xl font-bold text-gray-900">
                <button
                    id={headingId}
                    type="button"
                    disabled={workflow.isLocked}
                    aria-expanded={workflow.isOpen}
                    aria-controls={contentId}
                    onClick={workflow.onToggle}
                    className="flex w-full items-center gap-3 rounded-2xl p-5 text-left focus-visible:ring-2 focus-visible:ring-[#558b6e] focus-visible:outline-none focus-visible:ring-inset disabled:cursor-not-allowed sm:p-6"
                >
                    <span
                        className={cn(
                            'flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold',
                            workflow.isComplete
                                ? 'bg-[#558b6e] text-white'
                                : workflow.isLocked
                                  ? 'bg-gray-200 text-gray-500'
                                  : 'bg-[#558b6e]/15 text-[#35634b]',
                        )}
                    >
                        {workflow.isComplete ? (
                            <CheckIcon className="size-4" aria-hidden="true" />
                        ) : (
                            number
                        )}
                    </span>
                    <span className="min-w-0 grow">{title}</span>
                    {workflow.isLocked ? (
                        <LockIcon
                            className="size-4 shrink-0 text-gray-400"
                            aria-hidden="true"
                        />
                    ) : (
                        <ChevronDownIcon
                            className={cn(
                                'size-5 shrink-0 text-gray-500 transition-transform',
                                workflow.isOpen && 'rotate-180',
                            )}
                            aria-hidden="true"
                        />
                    )}
                </button>
            </h2>

            {workflow.isOpen && (
                <div
                    id={contentId}
                    role="region"
                    aria-labelledby={headingId}
                    className="border-t border-black/10 p-5 sm:p-6"
                >
                    <p className="mb-6 text-sm leading-6 text-gray-600">
                        {description}
                    </p>
                    {children}
                    <div className="mt-6 flex justify-end border-t border-black/10 pt-5">
                        <button
                            type="button"
                            onClick={workflow.onContinue}
                            className="inline-flex h-11 w-full items-center justify-center rounded-md bg-[#558b6e] px-6 text-sm font-semibold text-white shadow-md transition hover:bg-[#47775d] hover:shadow-lg focus-visible:ring-2 focus-visible:ring-[#558b6e] focus-visible:ring-offset-2 focus-visible:outline-none sm:w-auto"
                        >
                            {workflow.continueLabel ?? 'Continuar'}
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}
