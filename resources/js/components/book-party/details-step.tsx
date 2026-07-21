import type { RefObject } from 'react';
import { PartyChildFields } from '@/components/book-party/party-child-fields';
import type {
    BookingData,
    PartyChildField,
} from '@/components/book-party/types';
import { Button } from '@/components/ui/button';

type DetailsStepProps = {
    data: BookingData;
    headingRef: RefObject<HTMLHeadingElement | null>;
    canContinue: boolean;
    onChildChange: (
        childId: string,
        field: PartyChildField,
        value: string,
    ) => void;
    onAddChild: () => void;
    onRemoveChild: (childId: string) => void;
    onEmailChange: (value: string) => void;
    onGuestsChange: (value: string) => void;
    onBack: () => void;
    onContinue: () => void;
};

export function DetailsStep({
    data,
    headingRef,
    canContinue,
    onChildChange,
    onAddChild,
    onRemoveChild,
    onEmailChange,
    onGuestsChange,
    onBack,
    onContinue,
}: DetailsStepProps) {
    return (
        <>
            <div>
                <h2 ref={headingRef} tabIndex={-1}>
                    Detalhes da festa
                </h2>

                <p>Parque seleccionado: {data.park?.label ?? '-'}</p>
            </div>

            {data.children.map((child) => (
                <PartyChildFields
                    key={child.id}
                    child={child}
                    canRemove={data.children.length > 1}
                    onChange={onChildChange}
                    onRemove={onRemoveChild}
                />
            ))}

            <Button
                type="button"
                variant="secondary"
                className="self-start"
                onClick={onAddChild}
            >
                Adicionar outra criança
            </Button>

            <label className="flex flex-col gap-2">
                Email
                <input
                    type="email"
                    value={data.email}
                    onChange={(event) => onEmailChange(event.target.value)}
                    className="rounded-md border p-2"
                />
            </label>

            <label className="flex flex-col gap-2">
                Número de convidados
                <input
                    type="number"
                    min="1"
                    value={data.guests}
                    onChange={(event) => onGuestsChange(event.target.value)}
                    className="rounded-md border p-2"
                />
            </label>

            <div className="flex gap-3">
                <Button variant="secondary" type="button" onClick={onBack}>
                    Voltar
                </Button>

                <Button
                    type="button"
                    disabled={!canContinue}
                    onClick={onContinue}
                >
                    Próximo passo
                </Button>
            </div>
        </>
    );
}
