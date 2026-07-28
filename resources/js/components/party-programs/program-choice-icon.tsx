import {
    CupSodaIcon,
    DessertIcon,
    IceCreamBowlIcon,
    PizzaIcon,
    PopcornIcon,
} from 'lucide-react';
import type { PartyProgramChoiceIcon as ChoiceIcon } from '@/components/book-party/types';

export function ProgramChoiceIcon({
    icon,
    className = 'size-7',
}: {
    icon: ChoiceIcon;
    className?: string;
}) {
    if (icon === 'fries') {
        return <FriesIcon className={className} />;
    }

    if (icon === 'hot-dog') {
        return <HotDogIcon className={className} />;
    }

    const Icon = {
        popcorn: PopcornIcon,
        mousse: DessertIcon,
        gelatin: CupSodaIcon,
        'ice-cream': IceCreamBowlIcon,
        water: CupSodaIcon,
        juice: CupSodaIcon,
        pizza: PizzaIcon,
    }[icon];

    return <Icon aria-hidden="true" className={className} />;
}

function FriesIcon({ className }: { className: string }) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 32 32"
            fill="none"
            className={className}
        >
            <path
                d="M9 4h3l1 12H9V4Zm6-2h3v14h-3V2Zm6 3h3l-2 11h-4l3-11Z"
                fill="currentColor"
            />
            <path
                d="M7 14h18l-2.5 15h-13L7 14Z"
                fill="currentColor"
                opacity=".28"
            />
            <path
                d="M7 14h18l-2.5 15h-13L7 14Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function HotDogIcon({ className }: { className: string }) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 32 32"
            fill="none"
            className={className}
        >
            <path
                d="M5 20c-2-3 0-7 3-9l11-6c3-2 7-1 8 2s0 6-3 8l-12 7c-3 2-6 1-7-2Z"
                fill="currentColor"
                opacity=".25"
            />
            <path
                d="m8 18 15-9"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
            />
            <path
                d="m9 15 2 1 2-3 2 1 2-3 2 1 2-3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
