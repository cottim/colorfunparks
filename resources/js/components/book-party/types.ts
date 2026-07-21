export type PartyChild = {
    id: string;
    name: string;
    birthDate: string;
};

export type Park = {
    value: string;
    label: string;
};

export type BookingData = {
    park: Park | null;
    children: PartyChild[];
    email: string;
    guests: string;
};

export type PartyChildField = 'name' | 'birthDate';
