import { ArrowDownIcon, SparklesIcon } from 'lucide-react';
import { CtaButton } from '@/components/ui/cta-button';

export function FeaturedCampaignHero() {
    return (
        <section
            aria-labelledby="featured-campaign-title"
            className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8"
        >
            <div className="grid overflow-hidden rounded-3xl border border-black/10 bg-[#168fbc] text-white shadow-2xl lg:grid-cols-[1.05fr_0.95fr]">
                <div className="flex flex-col justify-center gap-6 p-6 sm:p-10 lg:p-12">
                    <div className="flex items-center gap-2 text-sm font-bold tracking-wide text-yellow-200 uppercase">
                        <SparklesIcon className="size-4" />
                        Campanha em destaque
                    </div>

                    <div className="space-y-4">
                        <p className="text-lg font-bold text-yellow-200">
                            Color Camp
                        </p>
                        <h1
                            id="featured-campaign-title"
                            className="text-4xl leading-tight font-black tracking-tight text-balance sm:text-5xl"
                        >
                            O verão que eles vão querer repetir
                        </h1>
                        <p className="max-w-xl text-base leading-7 text-blue-50 sm:text-lg">
                            Dias cheios de atividades, criatividade, movimento e
                            novas amizades num ambiente pensado para a diversão.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2 text-sm font-semibold">
                        {['Atividades', 'Diversão', 'Novas amizades'].map(
                            (highlight) => (
                                <span
                                    key={highlight}
                                    className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5"
                                >
                                    {highlight}
                                </span>
                            ),
                        )}
                    </div>

                    <CtaButton
                        asChild
                        attention="shine"
                        className="h-11 self-start px-5"
                    >
                        <a href="#programas">
                            Conhecer os nossos programas
                            <ArrowDownIcon />
                        </a>
                    </CtaButton>
                </div>

                <div className="relative min-h-96 bg-white/10 lg:min-h-160">
                    <img
                        src="/img/color_camp_1.jpg"
                        alt="Crianças e monitor durante uma atividade Color Camp"
                        className="absolute inset-0 size-full object-cover object-top"
                    />
                </div>
            </div>
        </section>
    );
}
