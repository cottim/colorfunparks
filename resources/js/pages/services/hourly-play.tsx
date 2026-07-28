import {
    Clock3Icon,
    PaintbrushIcon,
    ShieldCheckIcon,
    ShoppingBagIcon,
    SparklesIcon,
    UtensilsIcon,
} from 'lucide-react';
import type { CustomerFeedback } from '@/components/home/customer-feedback-section';
import { CustomerFeedbackSection } from '@/components/home/customer-feedback-section';
import type { GalleryImage } from '@/components/home/park-gallery-section';
import { ParkGallerySection } from '@/components/home/park-gallery-section';
import { ServicePageLayout } from '@/components/services/service-page-layout';

const galleryImages = [
    {
        id: 'hourly-play-park',
        src: '/img/dia-da-crianca.jpg',
        alt: 'Crianças a brincar numa atividade no parque',
    },
    {
        id: 'hourly-play-color-camp',
        src: '/img/color_camp_1.jpg',
        alt: 'Crianças acompanhadas por um monitor numa atividade',
    },
    {
        id: 'hourly-play-activities',
        src: '/img/color_camp_2.jpg',
        alt: 'Atividades preparadas pela equipa Color Fun Parks',
    },
] satisfies GalleryImage[];

const hourlyPlayFeedback = [
    {
        id: 'hourly-play-safe',
        quote: 'Consegui tratar de algumas compras com tranquilidade e a minha filha só queria ficar mais tempo.',
        attribution: 'Encarregado de educação',
        context: 'Brincar à hora',
        isPlaceholder: true,
    },
    {
        id: 'hourly-play-return',
        quote: 'É uma solução prática para uma tarde diferente, com acompanhamento e muita brincadeira.',
        attribution: 'Família visitante',
        context: 'Visita ao parque',
        isPlaceholder: true,
    },
    {
        id: 'hourly-play-extra',
        quote: 'Juntámos o lanche e as pinturas faciais e a visita acabou por ser um pequeno dia especial.',
        attribution: 'Família visitante',
        context: 'Brincar à hora com extras',
        isPlaceholder: true,
    },
] satisfies CustomerFeedback[];

export default function HourlyPlay() {
    return (
        <ServicePageLayout
            title="Brincar à hora"
            description="Brincar à hora na Color Fun Parks: uma solução flexível desde 5 € por hora, com acompanhamento atento e extras para tornar a visita especial."
            eyebrow="Brincar à hora"
            heading="Tempo para eles brincarem. Tempo para si."
            introduction="Vá ao cabeleireiro, trate das compras ou aproveite uma pausa enquanto a criança brinca num espaço pensado para a diversão, acompanhada por uma equipa treinada e atenta."
            highlight="1 hora desde 5 €"
            heroAside={
                <div className="flex size-full min-h-72 flex-col items-center justify-center gap-4 p-8 text-center text-white">
                    <div className="flex size-20 items-center justify-center rounded-full bg-white/15">
                        <Clock3Icon className="size-10" aria-hidden="true" />
                    </div>
                    <p className="text-sm font-bold tracking-wide text-green-100 uppercase">
                        Uma opção simples e flexível
                    </p>
                    <p className="max-w-xs text-2xl font-black">
                        Chegar, brincar e aproveitar
                    </p>
                </div>
            }
        >
            <section aria-labelledby="hourly-play-how-it-works">
                <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
                    <div className="space-y-4">
                        <p className="text-sm font-bold tracking-wide text-[#376b50] uppercase">
                            Como funciona
                        </p>
                        <h2
                            id="hourly-play-how-it-works"
                            className="text-3xl font-black tracking-tight sm:text-4xl"
                        >
                            Diversão sem precisar de uma ocasião especial
                        </h2>
                        <p className="leading-7 text-gray-700">
                            O Brincar à hora foi pensado para visitas flexíveis.
                            Escolhe o tempo, confirma a disponibilidade no
                            parque e deixa a criança explorar, mexer-se e
                            conviver num ambiente preparado para ela.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <article className="rounded-3xl border border-black/10 bg-white/80 p-6 shadow-lg">
                            <ShoppingBagIcon
                                className="size-7 text-[#376b50]"
                                aria-hidden="true"
                            />
                            <h3 className="mt-4 text-xl font-bold">
                                Flexível para a família
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-gray-600">
                                Uma hora para resolver um recado, fazer compras
                                ou simplesmente criar um momento diferente.
                            </p>
                        </article>
                        <article className="rounded-3xl border border-black/10 bg-white/80 p-6 shadow-lg">
                            <ShieldCheckIcon
                                className="size-7 text-[#376b50]"
                                aria-hidden="true"
                            />
                            <h3 className="mt-4 text-xl font-bold">
                                Acompanhamento atento
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-gray-600">
                                A equipa acompanha a permanência e está
                                disponível para apoiar a criança durante a
                                brincadeira.
                            </p>
                        </article>
                    </div>
                </div>
            </section>

            <section
                aria-labelledby="hourly-play-extras"
                className="bg-white/45"
            >
                <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
                    <div className="max-w-2xl space-y-3">
                        <p className="text-sm font-bold tracking-wide text-[#376b50] uppercase">
                            Extras
                        </p>
                        <h2
                            id="hourly-play-extras"
                            className="text-3xl font-black tracking-tight sm:text-4xl"
                        >
                            Acrescenta um pouco mais de cor
                        </h2>
                        <p className="leading-7 text-gray-700">
                            Os extras dependem do parque, do horário e da
                            disponibilidade da equipa. Confirma as opções antes
                            da visita.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        {[
                            {
                                icon: UtensilsIcon,
                                title: 'Lanche',
                                description:
                                    'Uma pausa saborosa durante a visita.',
                            },
                            {
                                icon: PaintbrushIcon,
                                title: 'Pinturas faciais',
                                description:
                                    'Uma personagem, um animal ou muita cor.',
                            },
                            {
                                icon: SparklesIcon,
                                title: 'Outras surpresas',
                                description:
                                    'Atividades especiais quando disponíveis.',
                            },
                        ].map(({ icon: Icon, title, description }) => (
                            <article
                                key={title}
                                className="rounded-2xl border border-black/10 bg-white/80 p-5 shadow-md"
                            >
                                <Icon
                                    className="size-6 text-[#376b50]"
                                    aria-hidden="true"
                                />
                                <h3 className="mt-3 font-bold">{title}</h3>
                                <p className="mt-1 text-sm text-gray-600">
                                    {description}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <ParkGallerySection
                images={galleryImages}
                id="hourly-play-gallery"
                eyebrow="O parque"
                title="Espaço para gastar energia e criar memórias"
                description="Para já, reutilizamos as imagens atuais. Esta galeria pode depois receber fotografias próprias do Brincar à hora escolhidas pelo cliente."
            />

            <CustomerFeedbackSection
                feedback={hourlyPlayFeedback}
                id="hourly-play-feedback"
                eyebrow="Experiências"
                title="O Brincar à hora visto pelas famílias"
                description="Textos ilustrativos para definir o tom desta página até recebermos opiniões reais e autorizadas."
            />
        </ServicePageLayout>
    );
}
