export type PartyChild = {
    name: string;
    age: string;
};

export type Park = {
    value: string;
    label: string;
};

export type PartyProgram = {
    value: string;
    label: string;
    description: string;
    accent: 'sky' | 'purple' | 'yellow';
    duration: string;
    minimumAge: number;
    maximumAge: number;
    guestAgeRange: string;
    availability: string;
    startingPrice: string;
    includes: string[];
    choiceGroups: PartyProgramChoiceGroup[];
    pricing: PartyProgramPrice[];
};

export type PartyProgramChoice = {
    value: string;
    label: string;
    icon: PartyProgramChoiceIcon;
};

export type PartyProgramChoiceGroup = {
    value: string;
    label: string;
    prompt?: string;
    description: string;
    options: PartyProgramChoice[];
};

export type PartyProgramPrice = {
    label: string;
    upToTwenty: string;
    extraChild: string;
};

export type PartyProgramChoiceIcon =
    | 'fries'
    | 'popcorn'
    | 'mousse'
    | 'gelatin'
    | 'ice-cream'
    | 'water'
    | 'juice'
    | 'pizza'
    | 'hot-dog';

export type PartyProgramBadge = {
    programValue: string;
    text: string;
    variant?: 'popular' | 'healthy' | 'recommended' | 'value';
};

export type PartyProgramSelection = {
    programValue: string;
    choices: Record<string, string>;
};

export type ContactDetails = {
    name: string;
    email: string;
    phone: string;
    privacyAccepted: boolean;
    termsAccepted: boolean;
    marketingAccepted: boolean;
};

export type AuthenticatedCustomer = {
    name: string;
    email: string;
    hasAcceptedLegalConsent: boolean;
    marketing: {
        status: 'not-authorized' | 'pending' | 'authorized';
        label: string;
        isAuthorized: boolean;
    };
};

export type BookingData = {
    contact: ContactDetails;
    park: Park | null;
    partyDate: string;
    partyTime: string;
    child: PartyChild;
    guests: string;
    program: PartyProgram | null;
    programChoices: Record<string, string>;
};

export type BookingOptions = {
    maxBookingMonthsAhead: number;
    parks: Park[];
    programs: PartyProgram[];
    partyTimes: string[];
};

export type PartyBookingPayload = {
    contact_name: string;
    email: string;
    phone: string;
    privacy_accepted: boolean;
    terms_accepted: boolean;
    marketing_accepted: boolean;
    park: string;
    child_name: string;
    child_age: string;
    party_date: string;
    party_time: string;
    guests: string;
    program: string;
    program_choices: Record<string, string>;
    website: string;
};

export type ContactField = keyof ContactDetails;
export type PartyChildField = keyof PartyChild;
export type PartyDetailsField = 'partyDate' | 'partyTime' | 'guests';

export type BookingStep = 'contact' | 'park' | 'child' | 'details' | 'program';
