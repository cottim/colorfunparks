import { Clock3Icon, PaintbrushIcon, SandwichIcon } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { HomeSectionHeading } from './home-section-heading';

const durations = [
    {
        duration: '1 hora',
        label: 'Uma visita rápida',
    },
    {
        duration: '2 horas',
        label: 'Mais tempo para explorar',
    },
    {
        duration: '3 horas',
        label: 'A experiência mais completa',
    },
];

export function HourlyPlaySection() {
    return (
        <section aria-labelledby="hourly-play-title">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
                <div>
                    <HomeSectionHeading
                        id="hourly-play-title"
                        eyebrow="Brincar à hora"
                        title="Chegar, brincar e aproveitar"
                        description="Uma opção flexível para visitas sem festa, entre uma e três horas. Valores e condições serão publicados quando a oferta final estiver definida."
                    />
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                    {durations.map(({ duration, label }) => (
                        <Card
                            key={duration}
                            className="relative overflow-hidden border-black/10 bg-white/80 text-center shadow-lg"
                        >
                            <CardHeader className="items-center gap-4">
                                <div className="flex size-12 items-center justify-center rounded-full bg-[#558b6e]/15 text-[#35694f]">
                                    <Clock3Icon className="size-6" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-gray-900">
                                        {duration}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {label}
                                    </p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="rounded-xl bg-gray-100 px-4 py-3 font-semibold text-gray-700">
                                    Preço a definir
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="rounded-2xl border border-black/10 bg-[#558b6e] p-6 text-white shadow-lg sm:p-8">
                    <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold">
                                Torna a visita ainda mais especial
                            </h3>
                            <p className="max-w-2xl text-sm leading-6 text-green-50">
                                Os serviços adicionais dependem do parque e da
                                disponibilidade. Estes exemplos serão ajustados
                                quando a oferta final estiver definida.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
                                <SandwichIcon className="size-4" />
                                Lanche
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">
                                <PaintbrushIcon className="size-4" />
                                Pinturas faciais
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
