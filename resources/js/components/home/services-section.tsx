import { Link } from '@inertiajs/react';
import {
    ArrowRightIcon,
    Clock3Icon,
    CreditCardIcon,
    SunIcon,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import type { ComponentType, SVGProps } from 'react';
import { PlayCardAccountCta } from '@/components/services/play-card-account-cta';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { create as createColorCampRegistration } from '@/routes/color-camp-registrations';
import { colorCamp, hourlyPlay, playCard } from '@/routes/services';
import { HomeSectionHeading } from './home-section-heading';

type Service = {
    title: string;
    description: string;
    highlight: string;
    linkLabel: string;
    href: ReturnType<typeof hourlyPlay>;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    accent: string;
    includesAccountCta?: boolean;
    action?: {
        label: string;
        href: ReturnType<typeof hourlyPlay>;
    };
};

const services: Service[] = [
    {
        title: 'Brincar à hora',
        description:
            'Uma opção flexível para a criança brincar enquanto trata do que precisa.',
        highlight: '1 hora desde 5 €',
        linkLabel: 'Vem brincar à hora',
        href: hourlyPlay(),
        icon: Clock3Icon,
        accent: 'bg-[#558b6e]/15 text-[#35694f]',
    },
    {
        title: 'Cartão da Brincadeira',
        description:
            'Mais visitas, vantagens e extras para famílias que voltam todos os meses.',
        highlight: 'Mais brincadeira, por menos',
        linkLabel: 'Conhecer o cartão',
        href: playCard(),
        icon: CreditCardIcon,
        accent: 'bg-purple-100 text-purple-700',
        includesAccountCta: true,
    },
    {
        title: 'Color Camp',
        description:
            'Dias de férias com atividades, novas amizades e acompanhamento especializado.',
        highlight: 'Verão 2026',
        linkLabel: 'Descobrir o Color Camp',
        href: colorCamp(),
        icon: SunIcon,
        accent: 'bg-sky-100 text-sky-700',
        action: {
            label: 'Inscrever no Color Camp',
            href: createColorCampRegistration(),
        },
    },
];

export function ServicesSection() {
    const reduceMotion = useReducedMotion();

    return (
        <section id="servicos" aria-labelledby="services-title">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
                <HomeSectionHeading
                    id="services-title"
                    eyebrow="Serviços"
                    title="Há sempre uma forma de brincar"
                    description="De uma visita rápida a dias completos de férias, encontra a opção certa para a tua família."
                />

                <div className="grid gap-5 md:grid-cols-3">
                    {services.map((service, index) => {
                        const Icon = service.icon;

                        return (
                            <motion.div
                                key={service.title}
                                initial={
                                    reduceMotion ? false : { opacity: 0, y: 20 }
                                }
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{
                                    duration: 0.4,
                                    delay: reduceMotion ? 0 : index * 0.08,
                                }}
                                whileHover={
                                    reduceMotion
                                        ? undefined
                                        : { y: -5, scale: 1.01 }
                                }
                                className="h-full"
                            >
                                <Card className="h-full overflow-hidden border-black/10 bg-white/85 shadow-lg">
                                    <CardHeader className="gap-5">
                                        <div
                                            className={cn(
                                                'flex size-12 items-center justify-center rounded-2xl',
                                                service.accent,
                                            )}
                                        >
                                            <Icon
                                                className="size-6"
                                                aria-hidden="true"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-sm font-bold text-[#376b50]">
                                                {service.highlight}
                                            </p>
                                            <h3 className="text-2xl font-black text-gray-900">
                                                {service.title}
                                            </h3>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="flex h-full flex-col gap-5">
                                        <p className="flex-1 text-sm leading-6 text-gray-600">
                                            {service.description}
                                        </p>
                                        <Link
                                            href={service.href}
                                            prefetch
                                            className="inline-flex items-center gap-2 font-bold text-[#376b50] underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-[#376b50] focus-visible:outline-none"
                                        >
                                            {service.linkLabel}
                                            <ArrowRightIcon
                                                className="size-4"
                                                aria-hidden="true"
                                            />
                                        </Link>
                                        {service.action && (
                                            <Button
                                                asChild
                                                className="w-full rounded-xl bg-[#558b6e] text-white hover:bg-[#376b50]"
                                            >
                                                <Link
                                                    href={service.action.href}
                                                >
                                                    {service.action.label}
                                                </Link>
                                            </Button>
                                        )}
                                        {service.includesAccountCta && (
                                            <PlayCardAccountCta appearance="compact" />
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
