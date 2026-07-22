import { addMonths } from 'date-fns';
import type { BookingData } from '@/components/book-party/types';

export type BookingDetailsValidation = {
    isValid: boolean;
    errors: BookingDetailsErrors;
};

export type PartyChildErrors = {
    name?: string;
    birthDate?: string;
};

export type ChildrenErrors = {
    message?: string;
    byId: Record<string, PartyChildErrors>;
};

export type BookingDetailsErrors = {
    children?: ChildrenErrors;
    email?: string;
    guests?: string;
    partyDate?: string;
};

export function validateBookingDetails(
    data: BookingData,
    maxBookingMonthsAhead: number,
): BookingDetailsValidation {
    const errors: BookingDetailsErrors = {};

    const childrenErrorsById: Record<string, PartyChildErrors> = {};

    for (const child of data.children) {
        const childErrors: PartyChildErrors = {};

        if (child.name.trim() === '') {
            childErrors.name = 'Indica o nome da criança.';
        }

        if (child.birthDate === '') {
            childErrors.birthDate = 'Indica a data de nascimento.';
        }

        if (Object.keys(childErrors).length > 0) {
            childrenErrorsById[child.id] = childErrors;
        }
    }

    if (data.children.length === 0) {
        errors.children = {
            message: 'Adiciona pelo menos uma criança.',
            byId: {},
        };
    } else if (Object.keys(childrenErrorsById).length > 0) {
        errors.children = {
            byId: childrenErrorsById,
        };
    }

    if (data.email.trim() === '') {
        errors.email = 'Indica um endereço de email.';
    } else if (!hasValidEmail(data.email)) {
        errors.email = 'Indica um endereço de email válido.';
    }

    if (data.guests.trim() === '') {
        errors.guests = 'Indica o número de convidados.';
    } else if (!hasValidGuestCount(data.guests)) {
        errors.guests = 'O número de convidados deve estar entre 10 e 100.';
    }

    if (data.partyDate.trim() === '') {
        errors.partyDate = 'Indica a data pretendida da festa.';
    } else if (new Date() >= new Date(data.partyDate)) {
        errors.partyDate = 'O dia da festa tem que ser depois do dia de hoje.';
    } else if (
        addMonths(new Date(), maxBookingMonthsAhead) >= new Date(data.partyDate)
    ) {
        errors.partyDate = `O dia da festa não pode ser superior a ${maxBookingMonthsAhead} meses.`;
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
}
function hasValidGuestCount(guests: string): boolean {
    const guestCount = Number(guests);

    return (
        Number.isInteger(guestCount) && guestCount >= 10 && guestCount <= 100
    );
}

function hasValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+$/.test(email);
}
