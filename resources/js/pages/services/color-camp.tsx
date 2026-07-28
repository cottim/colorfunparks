import { Link } from '@inertiajs/react';
import {
    CalendarDaysIcon,
    CheckIcon,
    Clock3Icon,
    MapPinIcon,
    ShieldCheckIcon,
    SparklesIcon,
    UsersIcon,
} from 'lucide-react';
import type { CustomerFeedback } from '@/components/home/customer-feedback-section';
import { CustomerFeedbackSection } from '@/components/home/customer-feedback-section';
import type { GalleryImage } from '@/components/home/park-gallery-section';
import { ParkGallerySection } from '@/components/home/park-gallery-section';
import { ServicePageLayout } from '@/components/services/service-page-layout';
import { CtaButton } from '@/components/ui/cta-button';
import { create as createColorCampRegistration } from '@/routes/color-camp-registrations';

const galleryImages = [
    {
        id: 'color-camp-group',
        src: '/img/color_camp_1.jpg',
        alt: 'Crianças e monitor durante uma atividade Color Camp',
    },
    {
        id: 'color-camp-program',
        src: '/img/color_camp_2.jpg',
        alt: 'Informações e atividades do Color Camp',
    },
    {
        id: 'color-camp-play',
        src: '/img/dia-da-crianca.jpg',
        alt: 'Crianças a participar numa atividade de grupo',
    },
] satisfies GalleryImage[];

const colorCampFeedback = [
    {
        id: 'color-camp-friends',
        quote: 'Chegou a casa a contar as atividades todas e a perguntar quando começava a semana seguinte.',
        attribution: 'Família participante',
        context: 'Color Camp',
        isPlaceholder: true,
    },
    {
        id: 'color-camp-team',
        quote: 'Sentimo-nos tranquilos com a atenção da equipa e com a variedade do programa.',
        attribution: 'Encarregado de educação',
        context: 'Semana Color Camp',
        isPlaceholder: true,
    },
    {
        id: 'color-camp-activities',
        quote: 'Entre oficinas, desporto e passeios, todos os dias trouxe uma história diferente.',
        attribution: 'Família participante',
        context: 'Atividades de verão',
        isPlaceholder: true,
    },
] satisfies CustomerFeedback[];

const activities = [
    'Praia',
    'Piscina',
    'Cinema',
    'Oficinas criativas',
    'Culinária',
    'Música e dança',
    'Festas temáticas',
    'Padel',
    'Jogos desportivos',
];

export default function ColorCamp() {
    return (
        <ServicePageLayout
            title="Color Camp — Verão 2026"
            description="Color Camp Verão 2026 na Color Fun Parks: programa de férias para crianças dos 4 aos 12 anos, com atividades acompanhadas por uma equipa experiente."
            eyebrow="Color Camp — Verão 2026"
            heading="Um verão cheio de aventuras e novas amizades"
            introduction="Um programa para crianças dos 4 aos 12 anos, com experiências variadas num ambiente seguro, acolhedor e acompanhado por uma equipa experiente em educação e animação infantil."
            highlight="3 a 28 de agosto de 2026"
            heroAside={
                <img
                    src="/img/color_camp_1.jpg"
                    alt="Crianças e monitor durante uma atividade Color Camp"
                    className="size-full min-h-72 object-cover object-top"
                />
            }
        >
            <section aria-labelledby="color-camp-details">
                <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
                    <div className="mx-auto max-w-2xl space-y-3 text-center">
                        <p className="text-sm font-bold tracking-wide text-[#376b50] uppercase">
                            Informações gerais
                        </p>
                        <h2
                            id="color-camp-details"
                            className="text-3xl font-black tracking-tight sm:text-4xl"
                        >
                            Tudo preparado para dias cheios
                        </h2>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            {
                                icon: CalendarDaysIcon,
                                label: 'Datas',
                                value: '3–28 de agosto',
                            },
                            {
                                icon: Clock3Icon,
                                label: 'Horário',
                                value: '9h–17h30',
                            },
                            {
                                icon: UsersIcon,
                                label: 'Idades',
                                value: '4–12 anos',
                            },
                            {
                                icon: MapPinIcon,
                                label: 'Local',
                                value: 'Color Party Fun Park',
                            },
                        ].map(({ icon: Icon, label, value }) => (
                            <article
                                key={label}
                                className="rounded-2xl border border-black/10 bg-white/80 p-5 text-center shadow-md"
                            >
                                <Icon
                                    className="mx-auto size-6 text-[#376b50]"
                                    aria-hidden="true"
                                />
                                <p className="mt-3 text-xs font-bold tracking-wide text-gray-500 uppercase">
                                    {label}
                                </p>
                                <p className="mt-1 font-black">{value}</p>
                            </article>
                        ))}
                    </div>

                    <p className="text-center text-sm text-gray-600">
                        Realiza-se em dias úteis; não inclui fins de semana nem
                        feriados. As vagas e semanas disponíveis são confirmadas
                        no formulário de inscrição.
                    </p>
                </div>
            </section>

            <section
                aria-labelledby="color-camp-activities"
                className="bg-white/45"
            >
                <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
                    <div className="space-y-3">
                        <p className="text-sm font-bold tracking-wide text-[#376b50] uppercase">
                            Atividades
                        </p>
                        <h2
                            id="color-camp-activities"
                            className="text-3xl font-black tracking-tight sm:text-4xl"
                        >
                            Cada dia traz uma experiência diferente
                        </h2>
                        <p className="leading-7 text-gray-700">
                            O programa combina movimento, criatividade,
                            descoberta e momentos de convívio. A programação
                            semanal é enviada antes do início de cada semana.
                        </p>
                    </div>

                    <ul className="grid gap-3 sm:grid-cols-2">
                        {activities.map((activity) => (
                            <li
                                key={activity}
                                className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white/80 px-4 py-3 font-semibold shadow-sm"
                            >
                                <SparklesIcon
                                    className="size-5 shrink-0 text-[#168fbc]"
                                    aria-hidden="true"
                                />
                                {activity}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section aria-labelledby="color-camp-prices">
                <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:px-8">
                    <div className="rounded-3xl border border-black/10 bg-white/85 p-6 shadow-xl sm:p-8">
                        <p className="text-sm font-bold tracking-wide text-[#376b50] uppercase">
                            Valores
                        </p>
                        <h2
                            id="color-camp-prices"
                            className="mt-2 text-3xl font-black"
                        >
                            Escolhe o formato
                        </h2>
                        <dl className="mt-6 divide-y divide-black/10">
                            <div className="flex justify-between gap-4 py-4">
                                <dt className="font-semibold">
                                    Semana completa
                                </dt>
                                <dd className="text-right font-black">
                                    110 € sem almoço
                                    <br />
                                    125 € com almoço
                                </dd>
                            </div>
                            <div className="flex justify-between gap-4 py-4">
                                <dt className="font-semibold">
                                    Duas ou mais semanas
                                </dt>
                                <dd className="text-right font-black">
                                    100 €/semana sem almoço
                                    <br />
                                    115 €/semana com almoço
                                </dd>
                            </div>
                            <div className="flex justify-between gap-4 py-4">
                                <dt className="font-semibold">Dia avulso</dt>
                                <dd className="text-right font-black">
                                    Desde 29 €
                                </dd>
                            </div>
                        </dl>
                        <p className="mt-4 text-sm leading-6 text-gray-600">
                            Almoço opcional por 3 €/dia. Existem descontos para
                            irmãos e portadores do Passaporte da Diversão; os
                            descontos não são acumuláveis.
                        </p>
                    </div>

                    <div className="rounded-3xl bg-[#558b6e] p-6 text-white shadow-xl sm:p-8">
                        <ShieldCheckIcon
                            className="size-9 text-yellow-200"
                            aria-hidden="true"
                        />
                        <h2 className="mt-4 text-3xl font-black">
                            O que está incluído
                        </h2>
                        <ul className="mt-6 space-y-4">
                            {[
                                'Lanche da tarde',
                                'Materiais para todas as atividades',
                                'Entradas e transporte nas atividades no exterior',
                                'Seguro de acidentes pessoais',
                                'Acolhimento desde as 8h e prolongamento até às 18h30 nas inscrições semanais, mediante marcação',
                            ].map((item) => (
                                <li
                                    key={item}
                                    className="flex items-start gap-3"
                                >
                                    <CheckIcon
                                        className="mt-0.5 size-5 shrink-0 text-yellow-200"
                                        aria-hidden="true"
                                    />
                                    <span className="leading-6 text-green-50">
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            <section className="bg-white/45">
                <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
                    <div className="flex flex-col gap-6 rounded-3xl bg-[#168fbc] p-6 text-white shadow-xl sm:p-10 lg:flex-row lg:items-center lg:justify-between">
                        <div className="max-w-2xl">
                            <p className="text-sm font-bold tracking-wide text-yellow-200 uppercase">
                                Vagas limitadas
                            </p>
                            <h2 className="mt-2 text-3xl font-black">
                                Consulta a disponibilidade e inscreve
                            </h2>
                            <p className="mt-3 leading-7 text-blue-50">
                                A vaga fica garantida depois do formulário e do
                                pagamento de 50% do valor. Confirma no
                                formulário as semanas ainda disponíveis e todas
                                as condições.
                            </p>
                        </div>
                        <CtaButton
                            asChild
                            attention="shine"
                            className="h-12 shrink-0 px-6"
                        >
                            <Link href={createColorCampRegistration()}>
                                Inscrever no Color Camp
                            </Link>
                        </CtaButton>
                    </div>
                </div>
            </section>

            <ParkGallerySection
                images={galleryImages}
                id="color-camp-gallery"
                eyebrow="Color Camp"
                title="Dias de descoberta, movimento e novas amizades"
                description="Alguns dos momentos e materiais atuais do programa Color Camp."
            />

            <CustomerFeedbackSection
                feedback={colorCampFeedback}
                id="color-camp-feedback"
                eyebrow="Experiências"
                title="O Color Camp contado pelas famílias"
                description="Textos ilustrativos até existirem opiniões reais aprovadas para publicação."
            />
        </ServicePageLayout>
    );
}
