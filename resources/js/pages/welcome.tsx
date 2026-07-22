import { Head, Link } from '@inertiajs/react';
import AnimatedColorFunParksLogo from '@/components/animated-color-fun-parks-logo';
import { BookParty } from '@/components/book-party/book-party';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';

export default function Welcome() {
    const banners = [
        '/img/color_camp_1.jpg',
        '/img/color_camp_2.jpg',
        '/img/dia-da-crianca.jpg',
    ];

    return (
        <>
            <Head />
            <div className="flex min-h-svh flex-col overflow-hidden bg-linear-to-b from-[#FFFE00] to-[#FFCD00]">
                <div className="flex justify-center p-2 lg:p-4">
                    <header className="w-full max-w-4xl text-sm not-has-[nav]:hidden">
                        <nav className="flex items-center justify-between gap-4">
                            <Link href="/">
                                <AnimatedColorFunParksLogo className="w-full max-w-3xs overflow-visible" />
                            </Link>
                            <BookParty></BookParty>
                        </nav>
                    </header>
                </div>
                <div className="mx-auto flex w-full max-w-4xl justify-center p-2 lg:px-8">
                    <Carousel className="mb-8 w-full rounded-xl">
                        <CarouselContent>
                            {banners.map((src) => (
                                <CarouselItem key={src}>
                                    <div className="aspect-4/5 overflow-hidden rounded-xl md:aspect-video">
                                        <img
                                            src={src}
                                            alt="Summer Camp banner"
                                            className="size-full object-cover"
                                        />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="hidden border-[#558b6e] bg-transparent text-[#558b6e] shadow-2xl hover:bg-[#558b6e] hover:text-gray-100 lg:flex dark:border-[#558b6e] dark:bg-transparent dark:hover:bg-[#558b6e] dark:hover:text-gray-100" />
                        <CarouselNext className="hidden border-[#558b6e] bg-transparent text-[#558b6e] shadow-2xl hover:bg-[#558b6e] hover:text-gray-100 lg:flex dark:border-[#558b6e] dark:bg-transparent dark:hover:bg-[#558b6e] dark:hover:text-gray-100" />
                    </Carousel>
                </div>
            </div>
        </>
    );
}
