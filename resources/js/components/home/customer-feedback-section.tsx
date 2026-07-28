import { QuoteIcon } from 'lucide-react';
import { HomeSectionHeading } from './home-section-heading';

export type CustomerFeedback = {
    id: string;
    quote: string;
    attribution: string;
    context: string;
    isPlaceholder?: boolean;
};

const exampleFeedback: CustomerFeedback[] = [
    {
        id: 'festa-organizada',
        quote: 'A equipa ajudou-nos a organizar tudo e as crianças aproveitaram cada minuto da festa.',
        attribution: 'Família da aniversariante',
        context: 'Festa de aniversário',
        isPlaceholder: true,
    },
    {
        id: 'comunicacao-simples',
        quote: 'Foi muito simples esclarecer as dúvidas e acompanhar os detalhes até ao dia da festa.',
        attribution: 'Encarregado de educação',
        context: 'Menu Color',
        isPlaceholder: true,
    },
    {
        id: 'querem-voltar',
        quote: 'Saíram de lá cansados, felizes e já a perguntar quando podiam voltar ao parque.',
        attribution: 'Família visitante',
        context: 'Brincar à hora',
        isPlaceholder: true,
    },
];

export function CustomerFeedbackSection({
    feedback = exampleFeedback,
    eyebrow = 'Quem nos visita',
    title = 'Momentos felizes, contados pelas famílias',
    description = 'Esta estrutura está pronta para receber opiniões reais aprovadas pelos clientes.',
    id = 'customer-feedback-title',
}: {
    feedback?: CustomerFeedback[];
    eyebrow?: string;
    title?: string;
    description?: string;
    id?: string;
}) {
    return (
        <section aria-labelledby={id} className="bg-[#376b50] text-white">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
                <HomeSectionHeading
                    id={id}
                    eyebrow={eyebrow}
                    title={title}
                    description={description}
                    variant="inverse"
                />

                <div className="grid gap-5 md:grid-cols-3">
                    {feedback.map((item) => (
                        <figure
                            key={item.id}
                            className="flex min-h-64 flex-col rounded-3xl border border-white/15 bg-white/10 p-6 shadow-xl backdrop-blur-sm"
                        >
                            <QuoteIcon
                                className="size-8 text-yellow-200"
                                aria-hidden="true"
                            />

                            <blockquote className="mt-5 flex-1 text-lg leading-8 font-semibold text-white">
                                “{item.quote}”
                            </blockquote>

                            <figcaption className="mt-6 border-t border-white/15 pt-4">
                                <p className="font-bold">{item.attribution}</p>
                                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-green-100">
                                    <span>{item.context}</span>
                                    {item.isPlaceholder && (
                                        <span className="rounded-full bg-yellow-200/15 px-2 py-0.5 text-xs font-bold text-yellow-100">
                                            Texto ilustrativo
                                        </span>
                                    )}
                                </div>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    );
}
