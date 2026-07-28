import { Link } from '@inertiajs/react';
import {
    AppleIcon,
    CakeSliceIcon,
    CheckIcon,
    ChevronDownIcon,
    Clock3Icon,
    SandwichIcon,
    UsersIcon,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';
import type {
    PartyProgram,
    PartyProgramBadge,
} from '@/components/book-party/types';
import { ProgramChoiceGroup } from '@/components/party-programs/program-choice-group';
import { CtaButton } from '@/components/ui/cta-button';
import { cn } from '@/lib/utils';
import { create as createPartyBooking } from '@/routes/party-bookings';
import { HomeSectionHeading } from './home-section-heading';

type PartyProgramsSectionProps = {
    programs: PartyProgram[];
    sharedIncludes: string[];
    badges?: PartyProgramBadge[];
    conditions: string[];
};

const accentStyles = {
    sky: {
        card: 'border-sky-300 bg-sky-50',
        icon: 'bg-sky-200 text-sky-900',
    },
    purple: {
        card: 'border-purple-300 bg-purple-50',
        icon: 'bg-purple-200 text-purple-900',
    },
    yellow: {
        card: 'border-amber-300 bg-amber-50',
        icon: 'bg-amber-200 text-amber-900',
    },
} as const;

const badgeStyles: Record<NonNullable<PartyProgramBadge['variant']>, string> = {
    popular: 'bg-[#e84855]',
    healthy: 'bg-[#558b6e]',
    recommended: 'bg-purple-600',
    value: 'bg-amber-600',
};

const contentTransition = {
    duration: 0.28,
    ease: [0.22, 1, 0.36, 1] as const,
};

export function PartyProgramsSection({
    programs,
    sharedIncludes,
    badges = [],
    conditions,
}: PartyProgramsSectionProps) {
    const featuredBadge = badges.find((badge) => badge.variant === 'popular');
    const initialProgram =
        programs.find(
            (program) => program.value === featuredBadge?.programValue,
        ) ?? programs[0];
    const [selectedProgramValue, setSelectedProgramValue] = useState(
        initialProgram?.value ?? '',
    );
    const [choices, setChoices] = useState<Record<string, string>>({});
    const reduceMotion = useReducedMotion();
    const selectedProgram =
        programs.find((program) => program.value === selectedProgramValue) ??
        initialProgram;

    if (!selectedProgram) {
        return null;
    }

    function selectProgram(program: PartyProgram) {
        setSelectedProgramValue(program.value);
        setChoices({});
    }

    function selectChoice(group: string, choice: string) {
        setChoices((currentChoices) => ({
            ...currentChoices,
            [group]: choice,
        }));
    }

    const selectedChoiceLabels = selectedProgram.choiceGroups.flatMap(
        (group) => {
            const choice = group.options.find(
                (option) => option.value === choices[group.value],
            );

            return choice ? [choice.label] : [];
        },
    );

    return (
        <section
            id="programas"
            aria-labelledby="party-programs-title"
            className="bg-white/45"
        >
            <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.08 }}
                transition={{
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                }}
                className="mx-auto flex w-full max-w-6xl flex-col gap-7 px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
            >
                <HomeSectionHeading
                    id="party-programs-title"
                    eyebrow="Festas"
                    title="Escolhe e personaliza o programa"
                    description="Compara as opções e monta uma primeira versão do menu. Podes confirmar ou alterar tudo no pedido de marcação."
                />

                <div className="rounded-2xl border border-black/10 bg-white/70 p-4 shadow-sm sm:flex sm:items-center sm:gap-5">
                    <h3 className="shrink-0 font-bold">
                        Todas as festas incluem
                    </h3>
                    <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 sm:mt-0">
                        {sharedIncludes.map((item, index) => (
                            <motion.li
                                key={item}
                                initial={
                                    reduceMotion ? false : { opacity: 0, x: -8 }
                                }
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    delay: 0.12 + index * 0.06,
                                    duration: 0.3,
                                }}
                                className="flex items-center gap-2 text-sm text-gray-700"
                            >
                                <CheckIcon className="size-4 shrink-0 text-[#558b6e]" />
                                {item}
                            </motion.li>
                        ))}
                    </ul>
                </div>

                <div
                    className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pt-3 pb-3 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0"
                    aria-label="Programas de festa"
                >
                    {programs.map((program, index) => (
                        <ProgramCard
                            key={program.value}
                            program={program}
                            sharedIncludes={sharedIncludes}
                            badge={badges.find(
                                (badge) => badge.programValue === program.value,
                            )}
                            selected={selectedProgram.value === program.value}
                            onSelect={() => selectProgram(program)}
                            index={index}
                            reduceMotion={reduceMotion}
                        />
                    ))}
                </div>

                <motion.div
                    layout={!reduceMotion}
                    aria-live="polite"
                    className="overflow-hidden rounded-3xl border border-black/10 bg-white/90 shadow-xl"
                >
                    <div className="grid gap-4 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={`${selectedProgram.value}-description`}
                                initial={
                                    reduceMotion
                                        ? false
                                        : { opacity: 0, x: -12 }
                                }
                                animate={{ opacity: 1, x: 0 }}
                                exit={
                                    reduceMotion
                                        ? undefined
                                        : { opacity: 0, x: 12 }
                                }
                                transition={contentTransition}
                            >
                                <p className="text-xs font-semibold tracking-wide text-[#558b6e] uppercase">
                                    Programa selecionado
                                </p>
                                <h3 className="mt-1 text-2xl font-bold">
                                    {selectedProgram.label}
                                </h3>
                                <p className="mt-1 text-sm text-gray-600">
                                    {selectedProgram.description}
                                </p>
                            </motion.div>
                        </AnimatePresence>

                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={`${selectedProgram.value}-facts`}
                                initial={
                                    reduceMotion ? false : { opacity: 0, x: 12 }
                                }
                                animate={{ opacity: 1, x: 0 }}
                                exit={
                                    reduceMotion
                                        ? undefined
                                        : { opacity: 0, x: -12 }
                                }
                                transition={contentTransition}
                                className="flex flex-wrap gap-2 lg:max-w-xl lg:justify-end"
                            >
                                <ProgramFact
                                    icon={<CakeSliceIcon />}
                                    label="Desde"
                                    value={selectedProgram.startingPrice}
                                />
                                <ProgramFact
                                    icon={<Clock3Icon />}
                                    label="Duração"
                                    value={selectedProgram.duration}
                                />
                                <ProgramFact
                                    icon={<UsersIcon />}
                                    label="Aniversário"
                                    value={selectedProgram.ageRange}
                                />
                                <ProgramFact
                                    icon={<UsersIcon />}
                                    label="Convidados"
                                    value={selectedProgram.guestAgeRange}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <motion.div
                        layout={!reduceMotion}
                        className="border-t border-black/10 bg-[#fff9d8] p-4 sm:p-5"
                    >
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
                            <div>
                                <h4 className="text-lg font-bold">
                                    Monta o menu
                                </h4>
                                <p className="text-sm text-gray-600">
                                    Escolhe agora ou completa mais tarde.
                                </p>
                            </div>
                            <p className="text-xs font-semibold text-gray-600">
                                {selectedProgram.availability}
                            </p>
                        </div>

                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={`${selectedProgram.value}-choices`}
                                layout={!reduceMotion}
                                initial={
                                    reduceMotion ? false : { opacity: 0, y: 10 }
                                }
                                animate={{ opacity: 1, y: 0 }}
                                exit={
                                    reduceMotion
                                        ? undefined
                                        : { opacity: 0, y: -8 }
                                }
                                transition={contentTransition}
                                className={cn(
                                    'mt-4 grid gap-3',
                                    selectedProgram.choiceGroups.length > 1 &&
                                        'md:grid-cols-2',
                                )}
                            >
                                {selectedProgram.choiceGroups.map((group) => (
                                    <ProgramChoiceGroup
                                        key={`${selectedProgram.value}-${group.value}`}
                                        group={group}
                                        selectedValue={choices[group.value]}
                                        namePrefix={`home-${selectedProgram.value}`}
                                        onSelect={(choice) =>
                                            selectChoice(group.value, choice)
                                        }
                                        compact
                                    />
                                ))}
                            </motion.div>
                        </AnimatePresence>

                        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0 rounded-xl border border-black/10 bg-white px-4 py-3 sm:flex-1">
                                <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                                    O teu menu
                                </p>
                                <p className="truncate font-semibold text-gray-900">
                                    {selectedChoiceLabels.length > 0
                                        ? selectedChoiceLabels.join(' · ')
                                        : 'Ainda sem escolhas'}
                                </p>
                            </div>

                            <CtaButton
                                asChild
                                attention="shine"
                                className="h-11 w-full sm:w-auto"
                            >
                                <Link
                                    href={createPartyBooking({
                                        query: {
                                            program: selectedProgram.value,
                                            choices,
                                        },
                                    })}
                                >
                                    <CakeSliceIcon />
                                    Continuar com este programa
                                </Link>
                            </CtaButton>
                        </div>
                    </motion.div>

                    <details className="group border-t border-black/10 bg-gray-50">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-bold select-none marker:hidden sm:px-6">
                            Ver preços e condições
                            <ChevronDownIcon className="size-5 shrink-0 transition group-open:rotate-180" />
                        </summary>

                        <div className="grid gap-6 border-t border-black/10 px-5 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
                            <div>
                                <h4 className="font-bold">Preços</h4>
                                <div className="mt-3 grid gap-3">
                                    {selectedProgram.pricing.map((price) => (
                                        <div
                                            key={price.label}
                                            className="rounded-xl border border-black/10 bg-white p-3 text-sm"
                                        >
                                            <p className="font-bold">
                                                {price.label}
                                            </p>
                                            <dl className="mt-2 grid gap-1 text-gray-600">
                                                <div className="flex justify-between gap-3">
                                                    <dt>Até 20 crianças</dt>
                                                    <dd className="font-semibold text-gray-900">
                                                        {price.upToTwenty}
                                                    </dd>
                                                </div>
                                                <div className="flex justify-between gap-3">
                                                    <dt>Criança extra</dt>
                                                    <dd className="font-semibold text-gray-900">
                                                        {price.extraChild}
                                                    </dd>
                                                </div>
                                            </dl>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold">Condições gerais</h4>
                                <ul className="mt-3 flex flex-wrap gap-2">
                                    {conditions.map((condition) => (
                                        <li
                                            key={condition}
                                            className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700"
                                        >
                                            {condition}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </details>
                </motion.div>
            </motion.div>
        </section>
    );
}

function ProgramCard({
    program,
    sharedIncludes,
    badge,
    selected,
    onSelect,
    index,
    reduceMotion,
}: {
    program: PartyProgram;
    sharedIncludes: string[];
    badge?: PartyProgramBadge;
    selected: boolean;
    onSelect: () => void;
    index: number;
    reduceMotion: boolean | null;
}) {
    const styles = accentStyles[program.accent];
    const distinctiveIncludes = program.includes.filter(
        (item) => !sharedIncludes.includes(item),
    );
    const Icon =
        program.value === 'balance'
            ? AppleIcon
            : program.value === 'lunch-party'
              ? SandwichIcon
              : CakeSliceIcon;

    return (
        <motion.button
            type="button"
            aria-pressed={selected}
            onClick={onSelect}
            layout={!reduceMotion}
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            whileHover={
                reduceMotion
                    ? undefined
                    : {
                          y: -4,
                          transition: { duration: 0.18, delay: 0 },
                      }
            }
            whileTap={
                reduceMotion
                    ? undefined
                    : {
                          scale: 0.985,
                          transition: { duration: 0.1, delay: 0 },
                      }
            }
            transition={{
                duration: 0.32,
                delay: reduceMotion ? 0 : index * 0.07,
            }}
            className={cn(
                'relative flex h-full min-w-64 snap-start flex-col items-start gap-3 rounded-2xl border p-4 text-left shadow-sm transition-shadow hover:shadow-lg focus-visible:ring-2 focus-visible:ring-[#558b6e] focus-visible:ring-offset-2 focus-visible:outline-none sm:min-w-0',
                styles.card,
            )}
        >
            {selected && (
                <motion.span
                    layoutId="selected-party-program"
                    className="pointer-events-none absolute -inset-0.5 rounded-2xl border-2 border-[#558b6e]"
                    transition={{
                        type: 'spring',
                        stiffness: 420,
                        damping: 34,
                    }}
                />
            )}
            {badge && (
                <span
                    className={cn(
                        'absolute -top-3 right-4 rounded-full px-3 py-1 text-xs font-bold text-white shadow-md',
                        badgeStyles[badge.variant ?? 'recommended'],
                    )}
                >
                    {badge.text}
                </span>
            )}
            <span className="flex items-center gap-3">
                <span
                    className={cn(
                        'flex size-9 shrink-0 items-center justify-center rounded-lg',
                        styles.icon,
                    )}
                >
                    <Icon className="size-4" />
                </span>
                <span className="block text-lg font-bold">{program.label}</span>
            </span>
            <span className="block text-sm leading-5 text-gray-600">
                {program.description}
            </span>
            <span className="grid gap-2">
                <span className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                    O que distingue este menu
                </span>
                <span className="grid gap-1">
                    {distinctiveIncludes.map((item) => (
                        <span
                            key={item}
                            className="flex items-start gap-2 text-xs text-gray-700"
                        >
                            <CheckIcon className="mt-0.5 size-3.5 shrink-0 text-[#558b6e]" />
                            {item}
                        </span>
                    ))}
                </span>
                <span className="text-xs font-semibold text-[#35634b]">
                    Escolhas:{' '}
                    {program.choiceGroups
                        .map((group) => group.label)
                        .join(' + ')}
                </span>
            </span>
            <span className="mt-auto flex w-full items-end justify-between gap-3 border-t border-black/10 pt-3">
                <span>
                    <span className="block text-xs text-gray-500">Desde</span>
                    <span className="font-bold">
                        {program.startingPrice}/criança
                    </span>
                </span>
                <span className="text-sm font-semibold text-[#35634b]">
                    {selected ? 'Selecionado' : 'Ver programa'}
                </span>
            </span>
        </motion.button>
    );
}

function ProgramFact({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2">
            <span className="text-[#558b6e] [&>svg]:size-4">{icon}</span>
            <span className="text-xs text-gray-500">{label}</span>
            <span className="text-sm font-bold whitespace-nowrap">{value}</span>
        </div>
    );
}
