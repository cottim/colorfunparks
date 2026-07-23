import { addMonths, startOfDay } from 'date-fns';

export type BookingDateRange = {
    earliestDate: Date;
    latestDate: Date;
};

export function createBookingDateRange(
    maxMonthsAhead: number,
    referenceDate = new Date(),
): BookingDateRange {
    const earliestDate = startOfDay(referenceDate);

    return {
        earliestDate,
        latestDate: addMonths(earliestDate, maxMonthsAhead),
    };
}
