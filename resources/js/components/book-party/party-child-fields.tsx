import { format, parseISO, subYears } from 'date-fns';
import { ChevronDownIcon, X } from 'lucide-react';
import { useState } from 'react';
import { pt } from 'react-day-picker/locale';
import type { PartyChildErrors } from '@/components/book-party/booking-validation';
import type {
    PartyChild,
    PartyChildField,
} from '@/components/book-party/types';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '../ui/calendar';

type PartyChildFieldsProps = {
    child: PartyChild;
    errors?: PartyChildErrors;
    showValidationErrors: boolean;
    canRemove: boolean;
    onChange: (childId: string, key: PartyChildField, value: string) => void;
    onRemove: (childId: string) => void;
};

export function PartyChildFields({
    child,
    errors,
    showValidationErrors,
    canRemove,
    onChange,
    onRemove,
}: PartyChildFieldsProps) {
    const [touchedFields, setTouchedFields] = useState({
        name: false,
        birthDate: false,
    });

    const [isBirthDateOpen, setIsBirthDateOpen] = useState(false);

    const selectedDate = child.birthDate
        ? parseISO(child.birthDate)
        : undefined;

    const fallbackMonth = subYears(new Date(), 5);

    const dateOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    };

    const nameError =
        touchedFields.name || showValidationErrors ? errors?.name : undefined;

    const birthDateError =
        touchedFields.birthDate || showValidationErrors
            ? errors?.birthDate
            : undefined;

    const nameInputId = `booking-child-${child.id}-name`;
    const nameErrorId = `${nameInputId}-error`;

    const birthDateInputId = `booking-child-${child.id}-birth-date`;
    const birthDateErrorId = `${birthDateInputId}-error`;

    return (
        <div className="flex flex-col gap-4">
            <FieldGroup
                className={`grid grid-cols-[1fr_1fr_30px] justify-center gap-2`}
            >
                <Field className="flex-1">
                    <Label htmlFor={nameInputId}>Nome da criança</Label>

                    <Input
                        id={nameInputId}
                        value={child.name}
                        required
                        aria-invalid={Boolean(nameError)}
                        aria-describedby={nameError ? nameErrorId : undefined}
                        onChange={(event) =>
                            onChange(child.id, 'name', event.target.value)
                        }
                        onBlur={() =>
                            setTouchedFields((current) => ({
                                ...current,
                                name: true,
                            }))
                        }
                        className="flex-1"
                    />

                    <InputError id={nameErrorId} message={nameError} />
                </Field>
                <Field>
                    <Label htmlFor={birthDateInputId}>Data de nascimento</Label>
                    <Popover
                        open={isBirthDateOpen}
                        onOpenChange={(isOpen) => {
                            setIsBirthDateOpen(isOpen);

                            if (!isOpen) {
                                setTouchedFields((current) => ({
                                    ...current,
                                    birthDate: true,
                                }));
                            }
                        }}
                    >
                        <PopoverTrigger asChild>
                            <Button
                                type="button"
                                id={birthDateInputId}
                                name={birthDateInputId}
                                variant="outline"
                                data-empty={!child.birthDate}
                                aria-invalid={Boolean(birthDateError)}
                                aria-describedby={
                                    birthDateError
                                        ? birthDateErrorId
                                        : undefined
                                }
                                className="justify-between bg-transparent text-left font-normal hover:bg-white/40 data-[empty=true]:text-muted-foreground dark:bg-transparent dark:hover:bg-white/40"
                            >
                                {child.birthDate ? (
                                    selectedDate?.toLocaleDateString(
                                        'pt-PT',
                                        dateOptions,
                                    )
                                ) : (
                                    <span>Data de Nascimento</span>
                                )}
                                <ChevronDownIcon />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                locale={pt}
                                mode="single"
                                selected={selectedDate}
                                defaultMonth={selectedDate ?? fallbackMonth}
                                startMonth={subYears(new Date(), 10)}
                                endMonth={
                                    new Date(
                                        new Date().getFullYear() - 5,
                                        new Date().getMonth() + 6,
                                    )
                                }
                                captionLayout="dropdown"
                                reverseYears
                                onSelect={(date) => {
                                    if (!date) {
                                        return;
                                    }

                                    onChange(
                                        child.id,
                                        'birthDate',
                                        format(date, 'yyyy-MM-dd'),
                                    );

                                    setTouchedFields((current) => ({
                                        ...current,
                                        birthDate: true,
                                    }));

                                    setIsBirthDateOpen(false);
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                    <InputError
                        id={birthDateErrorId}
                        message={birthDateError}
                    />
                </Field>
                {canRemove && (
                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="col-auto self-end"
                        onClick={() => onRemove(child.id)}
                    >
                        <X />
                    </Button>
                )}
            </FieldGroup>
        </div>
    );
}
