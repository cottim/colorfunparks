import type { Park, PartyProgram } from '@/components/book-party/types';

export const parks: readonly Park[] = [
    { value: 'color-party', label: 'Color Party' },
    { value: 'yupi-color', label: 'Yupi Color' },
    { value: 'kiddy-color', label: 'Kiddy Color' },
];

export const partyPrograms: readonly PartyProgram[] = [
    {
        value: 'essential',
        label: 'Festa Essencial',
        description: 'A proposta base para celebrar e brincar no parque.',
    },
    {
        value: 'snack',
        label: 'Festa com Lanche',
        description: 'A experiência de festa com uma opção de lanche.',
    },
    {
        value: 'special',
        label: 'Festa Especial',
        description: 'Uma celebração com serviços adicionais.',
    },
];

const firstPartyTimeInMinutes = 10 * 60;
const lastPartyTimeInMinutes = 17 * 60 + 30;
const partyTimeIntervalInMinutes = 30;

export const partyTimes = Array.from(
    {
        length:
            (lastPartyTimeInMinutes - firstPartyTimeInMinutes) /
                partyTimeIntervalInMinutes +
            1,
    },
    (_, index) => {
        const minutes =
            firstPartyTimeInMinutes + index * partyTimeIntervalInMinutes;
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        return `${hours.toString().padStart(2, '0')}:${remainingMinutes
            .toString()
            .padStart(2, '0')}`;
    },
);
