import { Link } from '@inertiajs/react';
import {
    CakeSliceIcon,
    CheckIcon,
    PaintbrushIcon,
    SandwichIcon,
} from 'lucide-react';
import type { ComponentType } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CtaButton } from '@/components/ui/cta-button';
import { create as createPartyBooking } from '@/routes/party-bookings';
import { HomeSectionHeading } from './home-section-heading';

type PartyProgram = {
    title: string;
    description: string;
    Icon: ComponentType<{ className?: string }>;
    color: string;
    suggestions: string[];
};

const partyPrograms: PartyProgram[] = [
    {
        title: 'Festa Essencial',
        description: 'Uma proposta simples para celebrar e brincar no parque.',
        Icon: CakeSliceIcon,
        color: 'bg-yellow-300 text-yellow-950',
        suggestions: [
            'Experiência base no parque',
            'Duração e condições a confirmar',
        ],
    },
    {
        title: 'Festa com Lanche',
        description:
            'A experiência de festa com uma opção de lanche a definir.',
        Icon: SandwichIcon,
        color: 'bg-sky-200 text-sky-950',
        suggestions: ['Inclui a proposta base', 'Menu e condições a confirmar'],
    },
    {
        title: 'Festa Especial',
        description:
            'Uma celebração com extras para tornar o dia ainda mais colorido.',
        Icon: PaintbrushIcon,
        color: 'bg-pink-200 text-pink-950',
        suggestions: ['Extras personalizáveis', 'Pinturas faciais como opção'],
    },
];

export function PartyProgramsSection() {
    return (
        <section
            id="programas"
            aria-labelledby="party-programs-title"
            className="bg-white/45"
        >
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
                <div>
                    <HomeSectionHeading
                        id="party-programs-title"
                        eyebrow="Festas"
                        title="Uma festa à medida de cada celebração"
                        description="Estas propostas são indicativas e serão atualizadas quando estiverem definidos os programas, durações e condições finais."
                    />
                </div>

                <div className="grid gap-5 md:grid-cols-3">
                    {partyPrograms.map(
                        ({ title, description, Icon, color, suggestions }) => (
                            <Card
                                key={title}
                                className="h-full border-black/10 bg-white/85 shadow-lg"
                            >
                                <CardHeader className="gap-4">
                                    <div
                                        className={`flex size-11 items-center justify-center rounded-xl ${color}`}
                                    >
                                        <Icon className="size-5" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {title}
                                        </h3>
                                        <p className="text-sm leading-6 text-gray-600">
                                            {description}
                                        </p>
                                    </div>
                                </CardHeader>

                                <CardContent className="mt-auto">
                                    <ul className="space-y-3 text-sm text-gray-700">
                                        {suggestions.map((suggestion) => (
                                            <li
                                                key={suggestion}
                                                className="flex items-start gap-2"
                                            >
                                                <CheckIcon className="mt-0.5 size-4 shrink-0 text-green-700" />
                                                {suggestion}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ),
                    )}
                </div>

                <CtaButton
                    asChild
                    attention="shine"
                    className="h-11 self-center px-6"
                >
                    <Link href={createPartyBooking()}>
                        <CakeSliceIcon />
                        Pedir marcação de festa
                    </Link>
                </CtaButton>
            </div>
        </section>
    );
}
