import { Head, Link } from '@inertiajs/react';
import { CalendarDaysIcon } from 'lucide-react';
import type {
    PartyProgram,
    PartyProgramBadge,
} from '@/components/book-party/types';
import { BlogSection } from '@/components/home/blog-section';
import { CustomerFeedbackSection } from '@/components/home/customer-feedback-section';
import { FeaturedCampaignHero } from '@/components/home/featured-campaign-hero';
import { NewsletterSection } from '@/components/home/newsletter-section';
import { ParkGallerySection } from '@/components/home/park-gallery-section';
import { PartyProgramsSection } from '@/components/home/party-programs-section';
import { ServicesSection } from '@/components/home/services-section';
import { PublicFooter } from '@/components/public-footer';
import { PublicHeader } from '@/components/public-header';
import { CtaButton } from '@/components/ui/cta-button';
import { create as createPartyBooking } from '@/routes/party-bookings';

export default function Welcome({
    partyPrograms,
    sharedPartyProgramIncludes,
    partyProgramBadges,
    partyProgramConditions,
    showNewsletter,
}: {
    partyPrograms: PartyProgram[];
    sharedPartyProgramIncludes: string[];
    partyProgramBadges: PartyProgramBadge[];
    partyProgramConditions: string[];
    showNewsletter: boolean;
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
                    <ServicesSection />
                    <ParkGallerySection />
                    <CustomerFeedbackSection />
                    <BlogSection />
                    {showNewsletter && <NewsletterSection />}
                </main>

                <PublicFooter className="mt-auto" />
            </div>
        </>
    );
}
