import type { RefObject } from 'react';
import type { BookingData } from '@/components/book-party/types';
import { Button } from '@/components/ui/button';

type ReviewStepProps = {
    data: BookingData;
    headingRef: RefObject<HTMLHeadingElement | null>;
    onBack: () => void;
    onConfirm: () => void;
};

export function ReviewStep({
    data,
    headingRef,
    onBack,
    onConfirm,
}: ReviewStepProps) {
    return (
        <>
            <h2 ref={headingRef} tabIndex={-1}>
                Verifique os detalhes
            </h2>

            <dl className="grid grid-cols-2 gap-3">
                <dt>Parque</dt>
                <dd>{data.park?.label ?? '-'}</dd>

                <dt>Criança</dt>
                <dd>
                    <ul className="flex flex-col gap-2">
                        {data.children.map((child) => (
                            <li key={child.id}>
                                {child.name}, {child.birthDate}
                            </li>
                        ))}
                    </ul>
                </dd>

                <dt>Email</dt>
                <dd>{data.email}</dd>

                <dt>Convidados</dt>
                <dd>{data.guests}</dd>
            </dl>

            <div className="flex gap-3">
                <Button variant="secondary" type="button" onClick={onBack}>
                    Voltar
                </Button>

                <Button type="button" onClick={onConfirm}>
                    Confirmar
                </Button>
            </div>
        </>
    );
}
