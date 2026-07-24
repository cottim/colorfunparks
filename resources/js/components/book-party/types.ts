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
};

export type ContactDetails = {
    name: string;
    email: string;
    phone: string;
    privacyAccepted: boolean;
    termsAccepted: boolean;
    marketingAccepted: boolean;
};

export type BookingData = {
    contact: ContactDetails;
    park: Park | null;
    partyDate: string;
    partyTime: string;
    child: PartyChild;
    guests: string;
    program: PartyProgram | null;
};

export type ContactField = keyof ContactDetails;
export type PartyChildField = keyof PartyChild;
export type PartyDetailsField = 'partyDate' | 'partyTime' | 'guests';

export type BookingStep = 'contact' | 'park' | 'child' | 'details' | 'program';
