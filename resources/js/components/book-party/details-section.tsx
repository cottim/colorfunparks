import { format, parseISO } from 'date-fns';
import { CalendarDaysIcon, ChevronDownIcon } from 'lucide-react';
import type { Dispatch } from 'react';
import { useState } from 'react';
import { pt } from 'react-day-picker/locale';
import type { BookingDateRange } from '@/components/book-party/booking-date-range';
import { partyTimes } from '@/components/book-party/booking-options';
import type { BookingAction } from '@/components/book-party/booking-reducer';
import { BookingSection } from '@/components/book-party/booking-section';
import type { BookingSectionWorkflow } from '@/components/book-party/booking-section';
import type { BookingErrors } from '@/components/book-party/booking-validation';
import type {
    BookingData,
    PartyDetailsField,
} from '@/components/book-party/types';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

type DetailsSectionProps = {
    data: BookingData;
    partyDateRange: BookingDateRange;
    errors: BookingErrors;
    showValidationErrors: boolean;
    dispatch: Dispatch<BookingAction>;
    workflow: BookingSectionWorkflow;
    onSelectionChange: (field: PartyDetailsField, value: string) => void;
    onFieldBlur: (field: PartyDetailsField, value: string) => void;
};

export function DetailsSection({
    data,
    partyDateRange,
    errors,
    showValidationErrors,
    dispatch,
    workflow,
    onSelectionChange,
    onFieldBlur,
}: DetailsSectionProps) {
    const [isPartyDateOpen, setIsPartyDateOpen] = useState(false);
    const partyDate = data.partyDate ? parseISO(data.partyDate) : undefined;

    return (
        <BookingSection
            number={4}
            title="Data, hora e convidados"
            description="Indica a tua preferência. A disponibilidade será confirmada pela nossa equipa."
            workflow={workflow}
        >
            <div className="grid gap-5 sm:grid-cols-2">
                <Field>
                    <Label htmlFor="booking-party-date">Data da festa</Label>
                    <Popover
                        open={isPartyDateOpen}
                        onOpenChange={setIsPartyDateOpen}
                    >
                        <PopoverTrigger asChild>
                            <Button
                                type="button"
                                id="booking-party-date"
                                variant="outline"
                                data-empty={!partyDate}
                                aria-invalid={
                                    showValidationErrors &&
                                    Boolean(errors.partyDate)
                                }
                                className="h-10 justify-between bg-white text-left font-normal data-[empty=true]:text-gray-500 dark:bg-white dark:text-gray-900"
                            >
                                {partyDate
                                    ? format(partyDate, 'dd/MM/yyyy')
                                    : 'Escolher data'}
                                <CalendarDaysIcon />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                locale={pt}
                                mode="single"
                                selected={partyDate}
                                defaultMonth={
                                    partyDate ?? partyDateRange.earliestDate
                                }
                                startMonth={partyDateRange.earliestDate}
                                endMonth={partyDateRange.latestDate}
                                onSelect={(date) => {
                                    if (!date) {
                                        return;
                                    }

                                    onSelectionChange(
                                        'partyDate',
                                        format(date, 'yyyy-MM-dd'),
                                    );
                                    setIsPartyDateOpen(false);
                                }}
                                disabled={[
                                    { before: partyDateRange.earliestDate },
                                    { after: partyDateRange.latestDate },
                                ]}
                            />
                        </PopoverContent>
                    </Popover>
                    <InputError
                        message={
                            showValidationErrors ? errors.partyDate : undefined
                        }
                    />
                </Field>

                <Field>
                    <Label htmlFor="booking-party-time">
                        Horário pretendido
                    </Label>
                    <div className="relative">
                        <select
                            id="booking-party-time"
                            name="party_time"
                            value={data.partyTime}
                            onChange={(event) =>
                                onSelectionChange(
                                    'partyTime',
                                    event.target.value,
                                )
                            }
                            required
                            aria-invalid={
                                showValidationErrors &&
                                Boolean(errors.partyTime)
                            }
                            className="h-10 w-full appearance-none rounded-md border border-input bg-white px-3 pr-9 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                        >
                            <option value="">Escolher horário</option>
                            {partyTimes.map((time) => (
                                <option key={time} value={time}>
                                    {time}
                                </option>
                            ))}
                        </select>
                        <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-gray-500" />
                    </div>
                    <InputError
                        message={
                            showValidationErrors ? errors.partyTime : undefined
                        }
                    />
                </Field>

                <Field className="sm:col-span-2 sm:max-w-xs">
                    <Label htmlFor="booking-guests">
                        Número previsto de convidados
                    </Label>
                    <Input
                        id="booking-guests"
                        name="guests"
                        type="number"
                        min="10"
                        max="100"
                        value={data.guests}
                        onChange={(event) =>
                            dispatch({
                                type: 'party.changed',
                                field: 'guests',
                                value: event.target.value,
                            })
                        }
                        onBlur={(event) =>
                            onFieldBlur('guests', event.target.value)
                        }
                        inputMode="numeric"
                        required
                        aria-invalid={
                            showValidationErrors && Boolean(errors.guests)
                        }
                    />
                    <InputError
                        message={
                            showValidationErrors ? errors.guests : undefined
                        }
                    />
                </Field>
            </div>
        </BookingSection>
    );
}
