import { format, parseISO } from 'date-fns';
import { StepHeading } from '@/components/book-party/step-heading';
import type { BookingData } from '@/components/book-party/types';
import { Button } from '@/components/ui/button';

type ReviewStepProps = {
    data: BookingData;
    onBack: () => void;
    onConfirm: () => void;
};

export function ReviewStep({ data, onBack, onConfirm }: ReviewStepProps) {
    return (
        <>
            <StepHeading>Verifique os detalhes</StepHeading>

            <dl className="grid grid-cols-2 gap-3">
                <dt>Parque</dt>
                <dd>{data.park?.label ?? '-'}</dd>

                <dt>Criança</dt>
                <dd>
                    <ul className="flex flex-col gap-2">
                        {data.children.map((child) => (
                            <li key={child.id}>
                                {child.name},{' '}
                                {format(
                                    parseISO(child.birthDate),
                                    'dd/MM/yyyy',
                                )}
                            </li>
                        ))}
                    </ul>
                </dd>

                <dt>Email</dt>
                <dd>{data.email}</dd>

                <dt>Data da Festa</dt>
                <dd>{format(parseISO(data.partyDate), 'dd/MM/yyyy')}</dd>

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
