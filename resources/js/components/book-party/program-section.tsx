import { CheckIcon, PartyPopperIcon } from 'lucide-react';
import { BookingSection } from '@/components/book-party/booking-section';
import type { BookingSectionWorkflow } from '@/components/book-party/booking-section';
import type { PartyProgram } from '@/components/book-party/types';
import InputError from '@/components/input-error';
import { ProgramChoiceGroup } from '@/components/party-programs/program-choice-group';

type ProgramSectionProps = {
    programs: readonly PartyProgram[];
    selectedProgram: PartyProgram | null;
    selectedChoices: Record<string, string>;
    error?: string;
    choiceError?: string;
    onSelect: (program: PartyProgram) => void;
    onChoiceSelect: (group: string, choice: string) => void;
    workflow: BookingSectionWorkflow;
};

export function ProgramSection({
    programs,
    selectedProgram,
    selectedChoices,
    error,
    choiceError,
    onSelect,
    onChoiceSelect,
    workflow,
}: ProgramSectionProps) {
    return (
        <BookingSection
            number={5}
            title="Programa da festa"
            description="As opções são provisórias e serão confirmadas com a proposta final."
            workflow={workflow}
        >
            <div className="grid gap-3">
                {programs.map((program) => (
                    <button
                        key={program.value}
                        type="button"
                        aria-pressed={selectedProgram?.value === program.value}
                        onClick={() => onSelect(program)}
                        className="relative flex items-start gap-4 rounded-xl border border-black/10 p-4 text-left transition hover:border-black/20 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-[#558b6e] focus-visible:outline-none aria-pressed:border-[#558b6e] aria-pressed:bg-[#558b6e]/10"
                    >
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-yellow-200 text-yellow-900">
                            <PartyPopperIcon className="size-5" />
                        </span>
                        <span className="space-y-1 pr-8">
                            <span className="block font-bold text-gray-900">
                                {program.label}
                            </span>
                            <span className="block text-sm leading-6 text-gray-600">
                                {program.description}
                            </span>
                            <span className="mt-2 block text-sm font-semibold text-[#35634b]">
                                {program.duration} · Desde{' '}
                                {program.startingPrice}/criança
                            </span>
                        </span>
                        {selectedProgram?.value === program.value && (
                            <span className="absolute top-4 right-4 flex size-5 items-center justify-center rounded-full bg-[#558b6e] text-white">
                                <CheckIcon className="size-3" />
                            </span>
                        )}
                    </button>
                ))}
            </div>
            <InputError className="mt-3" message={error} />

            {selectedProgram && (
                <div className="mt-5 grid gap-4 rounded-2xl bg-[#fff9d8] p-4 sm:p-5">
                    <div>
                        <h3 className="font-bold text-gray-900">
                            Personaliza o {selectedProgram.label}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                            Estas escolhas serão confirmadas pela nossa equipa.
                        </p>
                    </div>
                    {selectedProgram.choiceGroups.map((group) => (
                        <ProgramChoiceGroup
                            key={`${selectedProgram.value}-${group.value}`}
                            group={group}
                            selectedValue={selectedChoices[group.value]}
                            namePrefix={`booking-${selectedProgram.value}`}
                            onSelect={(choice) =>
                                onChoiceSelect(group.value, choice)
                            }
                        />
                    ))}
                    <InputError message={choiceError} />
                </div>
            )}
        </BookingSection>
    );
}
