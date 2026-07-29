import { BookingSection } from '@/components/book-party/booking-section';
import type { BookingSectionWorkflow } from '@/components/book-party/booking-section';
import type { BookingErrors } from '@/components/book-party/booking-validation';
import type {
    PartyChild,
    PartyChildField,
} from '@/components/book-party/types';
import InputError from '@/components/input-error';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type PartyChildFieldsProps = {
    child: PartyChild;
    minimumAge: number;
    maximumAge: number;
    selectedProgramLabel?: string;
    errors: BookingErrors;
    showValidationErrors: boolean;
    onChange: (key: PartyChildField, value: string) => void;
    onFieldBlur: (key: PartyChildField, value: string) => void;
    workflow: BookingSectionWorkflow;
};

export function PartyChildFields({
    child,
    minimumAge,
    maximumAge,
    selectedProgramLabel,
    errors,
    showValidationErrors,
    onChange,
    onFieldBlur,
    workflow,
}: PartyChildFieldsProps) {
    return (
        <BookingSection
            number={3}
            title="A criança"
            description="Para já, cada pedido corresponde à festa de uma criança."
            workflow={workflow}
        >
            <div className="grid items-start gap-5 sm:grid-cols-[minmax(0,1fr)_10rem]">
                <Field>
                    <Label htmlFor="booking-child-name">Nome da criança</Label>
                    <Input
                        id="booking-child-name"
                        name="child_name"
                        value={child.name}
                        onChange={(event) =>
                            onChange('name', event.target.value)
                        }
                        onBlur={(event) =>
                            onFieldBlur('name', event.target.value)
                        }
                        required
                        aria-invalid={
                            showValidationErrors && Boolean(errors.name)
                        }
                    />
                    <InputError
                        message={showValidationErrors ? errors.name : undefined}
                    />
                </Field>

                <Field>
                    <Label htmlFor="booking-child-age">Idade a celebrar</Label>
                    <Input
                        id="booking-child-age"
                        name="child_age"
                        type="number"
                        min={minimumAge}
                        max={maximumAge}
                        value={child.age}
                        onChange={(event) =>
                            onChange('age', event.target.value)
                        }
                        onBlur={(event) =>
                            onFieldBlur('age', event.target.value)
                        }
                        inputMode="numeric"
                        required
                        aria-invalid={
                            showValidationErrors && Boolean(errors.age)
                        }
                    />
                    <p className="text-xs leading-5 text-gray-500">
                        Dos {minimumAge} aos {maximumAge} anos
                        {selectedProgramLabel
                            ? ` para o ${selectedProgramLabel}`
                            : ''}
                        .
                    </p>
                    <InputError
                        message={showValidationErrors ? errors.age : undefined}
                    />
                </Field>
            </div>
        </BookingSection>
    );
}
