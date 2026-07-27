export type CustomerBookingStatus =
    'pending' | 'contacted' | 'confirmed' | 'cancelled';

export type CustomerBooking = {
    id: number;
    status: CustomerBookingStatus;
    statusLabel: string;
    park: string;
    childName: string;
    childAge: number;
    partyDate: string;
    partyTime: string;
    guests: number;
    program: string | null;
    contactName: string;
    contactEmail: string | null;
    contactPhone: string | null;
    createdAt: string;
};

export type PaginatedCustomerBookings = {
    data: CustomerBooking[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
};
