import { isAfter, isBefore, isValid, parseISO } from 'date-fns';
import type { BookingDateRange } from '@/components/book-party/booking-date-range';
import { partyTimes } from '@/components/book-party/booking-options';
import type { BookingData, BookingStep } from '@/components/book-party/types';

export type BookingValidation = {
    isValid: boolean;
    errors: BookingErrors;
};

export type BookingErrors = {
    contactName?: string;
    contactMethod?: string;
    email?: string;
    phone?: string;
    privacyAccepted?: string;
    termsAccepted?: string;
    park?: string;
    name?: string;
    age?: string;
    guests?: string;
    partyDate?: string;
    partyTime?: string;
    program?: string;
};

const bookingStepErrorFields: Record<
    BookingStep,
    readonly (keyof BookingErrors)[]
> = {
    contact: [
        'contactName',
        'contactMethod',
        'email',
        'phone',
        'privacyAccepted',
        'termsAccepted',
    ],
    park: ['park'],
    child: ['name', 'age'],
    details: ['guests', 'partyDate', 'partyTime'],
    program: ['program'],
};

export function validateBooking(
    data: BookingData,
    partyDateRange: BookingDateRange,
): BookingValidation {
    const errors: BookingErrors = {};

    if (data.contact.name.trim() === '') {
        errors.contactName = 'Indica o teu nome.';
    }

    const hasEmail = data.contact.email.trim() !== '';
    const hasPhone = data.contact.phone.trim() !== '';

    if (!hasEmail && !hasPhone) {
        errors.contactMethod = 'Indica um email ou número de telefone.';
    }

    if (hasEmail && !hasValidEmail(data.contact.email)) {
        errors.email = 'Indica um endereço de email válido.';
    }

    if (hasPhone && !hasValidPhone(data.contact.phone)) {
        errors.phone = 'Indica um número de telefone válido.';
    }

    if (!data.contact.privacyAccepted) {
        errors.privacyAccepted =
            'É necessário aceitar a Política de Privacidade.';
    }

    if (!data.contact.termsAccepted) {
        errors.termsAccepted = 'É necessário aceitar os Termos e Condições.';
    }

    if (!data.park) {
        errors.park = 'Escolhe o parque pretendido.';
    }

    if (data.child.name.trim() === '') {
        errors.name = 'Indica o nome da criança.';
    }

    if (data.child.age.trim() === '') {
        errors.age = 'Indica a idade que a criança vai celebrar.';
    } else if (!hasValidAge(data.child.age)) {
        errors.age = 'Indica uma idade válida.';
    }

    if (data.guests.trim() === '') {
        errors.guests = 'Indica o número de convidados.';
    } else if (!hasValidGuestCount(data.guests)) {
        errors.guests = 'O número de convidados deve estar entre 10 e 100.';
    }

    if (data.partyDate.trim() === '') {
        errors.partyDate = 'Indica a data pretendida da festa.';
    } else {
        const partyDate = parseISO(data.partyDate);

        if (!isValid(partyDate)) {
            errors.partyDate = 'Indica uma data válida.';
        } else if (isBefore(partyDate, partyDateRange.earliestDate)) {
            errors.partyDate = 'O dia da festa não pode estar no passado.';
        } else if (isAfter(partyDate, partyDateRange.latestDate)) {
            errors.partyDate =
                'O dia da festa ultrapassa o período disponível para reservas.';
        }
    }

    if (data.partyTime === '') {
        errors.partyTime = 'Escolhe o horário pretendido.';
    } else if (!partyTimes.includes(data.partyTime)) {
        errors.partyTime = 'Escolhe um horário válido.';
    }

    if (!data.program) {
        errors.program = 'Escolhe o programa pretendido.';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
}

export function isBookingStepValid(
    step: BookingStep,
    errors: BookingErrors,
): boolean {
    return bookingStepErrorFields[step].every((field) => !errors[field]);
}

function hasValidAge(age: string): boolean {
    const numericAge = Number(age);

    return Number.isInteger(numericAge) && numericAge >= 1 && numericAge <= 99;
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

function hasValidPhone(phone: string): boolean {
    const digits = phone.replace(/\D/g, '');

    return digits.length >= 9 && digits.length <= 15;
}
