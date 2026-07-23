import { Head, Link } from '@inertiajs/react';
import { CalendarDaysIcon } from 'lucide-react';
import AnimatedColorFunParksLogo from '@/components/animated-color-fun-parks-logo';
import { FeaturedCampaignHero } from '@/components/home/featured-campaign-hero';
import { HourlyPlaySection } from '@/components/home/hourly-play-section';
import { NewsletterSection } from '@/components/home/newsletter-section';
import { ParkGallerySection } from '@/components/home/park-gallery-section';
import { PartyProgramsSection } from '@/components/home/party-programs-section';
import { PublicFooter } from '@/components/public-footer';
import { CtaButton } from '@/components/ui/cta-button';
import { home } from '@/routes';
import { create as createPartyBooking } from '@/routes/party-bookings';

export default function Welcome() {
    return (
        <>
            <Head title="Parques de diversão para crianças" />
            <div className="flex min-h-svh flex-col overflow-hidden bg-linear-to-b from-[#FFFE00] to-[#FFCD00] text-gray-900">
                <header className="border-b border-black/10">
                    <nav className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
                        <div className="min-w-0">
                            <Link href={home()}>
                                <AnimatedColorFunParksLogo className="w-full max-w-3xs overflow-visible" />
                            </Link>
                        </div>
                        <CtaButton asChild attention="shine">
                            <Link href={createPartyBooking()}>
                                <CalendarDaysIcon />
                                <span className="hidden sm:inline">
                                    Agendar Festa
                                </span>
                                <span className="sm:hidden">Festa</span>
                            </Link>
                        </CtaButton>
                    </nav>
                </header>

                <main className="flex-1">
                    <FeaturedCampaignHero />
                    <PartyProgramsSection />
                    <HourlyPlaySection />
                    <ParkGallerySection />
                    <NewsletterSection />
                </main>

                <PublicFooter className="mt-auto" />
            </div>
        </>
    );
}
