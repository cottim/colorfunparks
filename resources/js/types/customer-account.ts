export type CustomerBookingStatus =
    'pending' | 'contacted' | 'confirmed' | 'cancelled';

export type CustomerBooking = {
    id: number;
    reference: string;
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

export type CustomerColorCampRegistrationStatus =
    'pending' | 'reviewing' | 'confirmed' | 'waitlisted' | 'cancelled';

export type CustomerColorCampRegistration = {
    id: number;
    reference: string;
    status: CustomerColorCampRegistrationStatus;
    statusLabel: string;
    childName: string;
    childBirthDate: string;
    attendanceType: string;
    attendanceLabel: string;
    selectedPeriods: string[];
    lunchOption: string;
    discount: string | null;
    needsExtendedCare: boolean;
    tripAuthorized: boolean;
    photoConsent: string;
    allergiesAndHealthNotes: string | null;
    authorizedPickupName: string;
    authorizedPickupPhone: string;
    contactPhone: string;
    notes: string | null;
    createdAt: string;
};

export type PaginatedCustomerColorCampRegistrations = {
    data: CustomerColorCampRegistration[];
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
