export type Status = {
    value: string;
    label: string;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type Pagination<T> = {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
};

export type ManagedPartyBooking = {
    id: number;
    status: Status;
    customer: {
        name: string;
        email: string;
    };
    park: string;
    child: {
        name: string;
        age: number;
    };
    party_date: string;
    party_time: string;
    guests: number;
    program: string;
    created_at: string | null;
};

export type ManagedCustomer = {
    id: number;
    name: string;
    email: string;
    marketing: Status;
    party_bookings_count: number;
    created_at: string | null;
};

export type InternalUser = {
    id: number;
    name: string;
    email: string;
    role: Status;
    created_at: string | null;
};

export type StaffInvitation = {
    id: number;
    email: string;
    role: Status;
    expires_at: string;
    created_at: string | null;
};
