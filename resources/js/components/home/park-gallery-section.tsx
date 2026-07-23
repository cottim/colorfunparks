import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { HomeSectionHeading } from './home-section-heading';

const galleryImages = [
    {
        id: 'color-camp-experience',
        src: '/img/color_camp_1.jpg',
        alt: 'Crianças e monitor numa atividade Color Camp',
    },
    {
        id: 'color-camp-information',
        src: '/img/color_camp_2.jpg',
        alt: 'Informações sobre o programa Color Camp',
    },
    {
        id: 'childrens-day',
        src: '/img/dia-da-crianca.jpg',
        alt: 'Crianças a brincar durante uma atividade no parque',
    },
    {
        id: 'color-camp-experience-repeat',
        src: '/img/color_camp_1.jpg',
        alt: '',
    },
    {
        id: 'childrens-day-repeat',
        src: '/img/dia-da-crianca.jpg',
        alt: '',
    },
    {
        id: 'color-camp-information-repeat',
        src: '/img/color_camp_2.jpg',
        alt: '',
    },
];

export function ParkGallerySection() {
    return (
        <section aria-labelledby="park-gallery-title" className="bg-white/45">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
                <div>
                    <HomeSectionHeading
                        id="park-gallery-title"
                        eyebrow="Galeria"
                        title="Um pouco da diversão"
                        description="Descobre alguns dos momentos, atividades e campanhas que dão ainda mais cor aos nossos parques."
                    />
                </div>

                <Carousel
                    opts={{ align: 'start' }}
                    aria-label="Galeria Color Fun Parks"
                >
                    <CarouselContent>
                        {galleryImages.map(({ id, src, alt }) => (
                            <CarouselItem
                                key={id}
                                className="basis-4/5 sm:basis-1/2 lg:basis-1/3"
                            >
                                <div className="aspect-4/5 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-lg">
                                    <img
                                        src={src}
                                        alt={alt}
                                        className="size-full object-cover"
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2 hidden border-white/60 bg-white/90 text-gray-900 shadow-lg hover:bg-white sm:flex dark:border-white/60 dark:bg-white/90 dark:text-gray-900 dark:hover:bg-white" />
                    <CarouselNext className="right-2 hidden border-white/60 bg-white/90 text-gray-900 shadow-lg hover:bg-white sm:flex dark:border-white/60 dark:bg-white/90 dark:text-gray-900 dark:hover:bg-white" />
                </Carousel>
            </div>
        </section>
    );
}
