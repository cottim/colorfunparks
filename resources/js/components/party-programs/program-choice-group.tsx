import { CheckIcon } from 'lucide-react';
import type { PartyProgramChoiceGroup as ChoiceGroup } from '@/components/book-party/types';
import { ProgramChoiceIcon } from '@/components/party-programs/program-choice-icon';
import { cn } from '@/lib/utils';

export function ProgramChoiceGroup({
    group,
    selectedValue,
    onSelect,
    namePrefix = 'program-choice',
    error,
    compact = false,
}: {
    group: ChoiceGroup;
    selectedValue?: string;
    onSelect: (value: string) => void;
    namePrefix?: string;
    error?: string;
    compact?: boolean;
}) {
    const errorId = error ? `${namePrefix}-${group.value}-error` : undefined;

    return (
        <fieldset
            aria-describedby={errorId}
            className={cn(
                'grid rounded-xl border border-black/10 bg-white/70',
                compact ? 'gap-2 p-3' : 'gap-3 p-4',
            )}
        >
            <legend className="px-1 font-bold text-gray-900">
                {compact && group.prompt ? group.prompt : group.label}
            </legend>
            <p className={cn('text-sm text-gray-600', compact && 'sr-only')}>
                {group.description}
            </p>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                {group.options.map((option) => {
                    const isSelected = selectedValue === option.value;

                    return (
                        <label
                            key={option.value}
                            className={cn(
                                'relative flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border bg-white px-3 py-3 text-center text-sm font-semibold text-gray-800 shadow-xs transition focus-within:ring-2 focus-within:ring-[#558b6e] focus-within:ring-offset-2 hover:-translate-y-0.5 hover:border-[#558b6e]/60 hover:shadow-md',
                                compact && 'min-h-16 flex-row py-2',
                                isSelected &&
                                    'border-[#558b6e] bg-[#558b6e]/10 text-[#315d47]',
                            )}
                        >
                            <input
                                type="radio"
                                name={`${namePrefix}-${group.value}`}
                                value={option.value}
                                checked={isSelected}
                                onChange={() => onSelect(option.value)}
                                className="sr-only"
                            />
                            <ProgramChoiceIcon
                                icon={option.icon}
                                className={compact ? 'size-6' : 'size-8'}
                            />
                            <span>{option.label}</span>
                            {isSelected && (
                                <span className="absolute top-2 right-2 flex size-5 items-center justify-center rounded-full bg-[#558b6e] text-white">
                                    <CheckIcon className="size-3" />
                                </span>
                            )}
                        </label>
                    );
                })}
            </div>
            {error && (
                <p
                    id={errorId}
                    role="alert"
                    className="text-sm font-medium text-destructive"
                >
                    {error}
                </p>
            )}
        </fieldset>
    );
}
