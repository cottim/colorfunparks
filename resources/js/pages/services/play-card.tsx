import { Link } from '@inertiajs/react';
import {
    BadgePercentIcon,
    CreditCardIcon,
    GiftIcon,
    Repeat2Icon,
    SparklesIcon,
} from 'lucide-react';
import type { CustomerFeedback } from '@/components/home/customer-feedback-section';
import { CustomerFeedbackSection } from '@/components/home/customer-feedback-section';
import { PlayCardAccountCta } from '@/components/services/play-card-account-cta';
import { ServicePageLayout } from '@/components/services/service-page-layout';
import { colorCamp } from '@/routes/services';

const playCardFeedback = [
    {
        id: 'play-card-routine',
        quote: 'Passou a fazer parte da nossa rotina mensal e acabamos por aproveitar muito mais o parque.',
        attribution: 'Família visitante',
        context: 'Cartão da Brincadeira',
        isPlaceholder: true,
    },
    {
        id: 'play-card-benefits',
        quote: 'Os extras dão variedade às visitas e tornam o cartão fácil de aproveitar.',
        attribution: 'Encarregado de educação',
        context: 'Vantagens do cartão',
        isPlaceholder: true,
    },
    {
        id: 'play-card-camp',
        quote: 'Além das visitas, ainda conseguimos uma vantagem na inscrição do Color Camp.',
        attribution: 'Família visitante',
        context: 'Cartão e Color Camp',
        isPlaceholder: true,
    },
] satisfies CustomerFeedback[];

export default function PlayCard() {
    return (
        <ServicePageLayout
            title="Cartão da Brincadeira"
            description="Conhece o Cartão da Brincadeira da Color Fun Parks: mais opções por menos, extras no Brincar à hora e vantagens em iniciativas como o Color Camp."
            eyebrow="Cartão da Brincadeira"
            heading="Mais brincadeira. Mais vantagens."
            introduction="O Cartão da Brincadeira é gratuito e fica disponível quando crias a tua conta. A criação da conta e cada nova utilização ativam 30 dias de benefícios."
            highlight="Gratuito com a tua conta"
            heroAside={
                <div className="flex size-full min-h-72 items-center justify-center p-8">
                    <div className="relative flex aspect-[1.58/1] w-full max-w-sm flex-col justify-between overflow-hidden rounded-3xl bg-linear-to-br from-purple-600 to-sky-500 p-7 text-white shadow-2xl">
                        <SparklesIcon
                            className="absolute -top-5 -right-5 size-28 text-white/15"
                            aria-hidden="true"
                        />
                        <CreditCardIcon className="size-8" aria-hidden="true" />
                        <div>
                            <p className="text-xl font-black">
                                Cartão da Brincadeira
                            </p>
                            <p className="mt-1 text-sm text-purple-100">
                                Color Fun Parks
                            </p>
                        </div>
                    </div>
                </div>
            }
        >
            <PlayCardAccountCta className="pt-4 sm:pt-8" />

            <section aria-labelledby="play-card-benefits">
                <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
                    <div className="mx-auto max-w-2xl space-y-3 text-center">
                        <p className="text-sm font-bold tracking-wide text-[#376b50] uppercase">
                            Vantagens previstas
                        </p>
                        <h2
                            id="play-card-benefits"
                            className="text-3xl font-black tracking-tight sm:text-4xl"
                        >
                            Um cartão pensado para quem gosta de voltar
                        </h2>
                        <p className="leading-7 text-gray-700">
                            A oferta final, o preço e as condições ainda serão
                            definidos. Esta página apresenta a estrutura
                            proposta para o serviço.
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-3">
                        {[
                            {
                                icon: Repeat2Icon,
                                title: 'Usa todos os meses',
                                description:
                                    'Cada utilização renova as vantagens do cartão durante mais 30 dias.',
                            },
                            {
                                icon: GiftIcon,
                                title: 'Extras gratuitos',
                                description:
                                    'Com os benefícios ativos, recebe extras selecionados do Brincar à hora.',
                            },
                            {
                                icon: BadgePercentIcon,
                                title: 'Até 10% de desconto',
                                description:
                                    'Beneficia de descontos em iniciativas selecionadas, sujeitos às condições em vigor.',
                            },
                        ].map(({ icon: Icon, title, description }) => (
                            <article
                                key={title}
                                className="rounded-3xl border border-black/10 bg-white/80 p-6 shadow-lg"
                            >
                                <div className="flex size-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
                                    <Icon
                                        className="size-6"
                                        aria-hidden="true"
                                    />
                                </div>
                                <h3 className="mt-5 text-xl font-bold">
                                    {title}
                                </h3>
                                <p className="mt-2 text-sm leading-6 text-gray-600">
                                    {description}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-white/45">
                <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
                    <div className="grid overflow-hidden rounded-3xl bg-[#168fbc] text-white shadow-xl lg:grid-cols-[1fr_auto] lg:items-center">
                        <div className="space-y-3 p-6 sm:p-9">
                            <p className="text-sm font-bold tracking-wide text-yellow-200 uppercase">
                                Uma das iniciativas
                            </p>
                            <h2 className="text-3xl font-black">
                                Poupa também no Color Camp
                            </h2>
                            <p className="max-w-2xl leading-7 text-blue-50">
                                O cartão poderá dar acesso a descontos até 10%
                                em iniciativas selecionadas, como o programa de
                                férias Color Camp.
                            </p>
                        </div>
                        <div className="p-6 pt-0 sm:p-9 sm:pt-0 lg:pt-9 lg:pl-0">
                            <Link
                                href={colorCamp()}
                                className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-5 font-bold text-[#116e91] shadow-md transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#168fbc] focus-visible:outline-none"
                            >
                                Conhecer o Color Camp
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <CustomerFeedbackSection
                feedback={playCardFeedback}
                id="play-card-feedback"
                eyebrow="Experiências"
                title="O cartão na rotina das famílias"
                description="Textos ilustrativos enquanto o serviço e os testemunhos reais ainda estão a ser preparados."
            />
        </ServicePageLayout>
    );
}
