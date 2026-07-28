import { Head, Link } from '@inertiajs/react';
import { CalendarDaysIcon } from 'lucide-react';
import type {
    PartyProgram,
    PartyProgramBadge,
} from '@/components/book-party/types';
import { FeaturedCampaignHero } from '@/components/home/featured-campaign-hero';
import { HourlyPlaySection } from '@/components/home/hourly-play-section';
import { NewsletterSection } from '@/components/home/newsletter-section';
import { ParkGallerySection } from '@/components/home/park-gallery-section';
import { PartyProgramsSection } from '@/components/home/party-programs-section';
import { PublicFooter } from '@/components/public-footer';
import { PublicHeader } from '@/components/public-header';
import { CtaButton } from '@/components/ui/cta-button';
import { create as createPartyBooking } from '@/routes/party-bookings';

export default function Welcome({
    partyPrograms,
    sharedPartyProgramIncludes,
    partyProgramBadges,
    partyProgramConditions,
}: {
    partyPrograms: PartyProgram[];
    sharedPartyProgramIncludes: string[];
    partyProgramBadges: PartyProgramBadge[];
    partyProgramConditions: string[];
}) {
    return (
        <>
            <Head title="Parques de diversão para crianças" />
            <div className="flex min-h-svh flex-col overflow-hidden bg-linear-to-b from-[#FFFE00] to-[#FFCD00] text-gray-900">
                <PublicHeader>
                    <CtaButton asChild attention="shine">
                        <Link href={createPartyBooking()}>
                            <CalendarDaysIcon />
                            <span className="hidden sm:inline">
                                Agendar Festa
                            </span>
                            <span className="sm:hidden">Festa</span>
                        </Link>
                    </CtaButton>
                </PublicHeader>

                <main className="flex-1">
                    <FeaturedCampaignHero />
                    <PartyProgramsSection
                        programs={partyPrograms}
                        sharedIncludes={sharedPartyProgramIncludes}
                        badges={partyProgramBadges}
                        conditions={partyProgramConditions}
                    />
                    <HourlyPlaySection />
                    <ParkGallerySection />
                    <NewsletterSection />
                </main>

                <PublicFooter className="mt-auto" />
            </div>
        </>
    );
}
