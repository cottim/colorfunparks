import { FerrisWheelIcon } from 'lucide-react';
import { StepHeading } from '@/components/book-party/step-heading';
import type { Park } from '@/components/book-party/types';

type ParkStepProps = {
    parks: readonly Park[];
    onSelect: (park: Park) => void;
};

export function ParkStep({ parks, onSelect }: ParkStepProps) {
    return (
        <>
            <StepHeading className="flex items-center gap-2">
                <FerrisWheelIcon />
                Escolhe o teu parque
            </StepHeading>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {parks.map((park) => (
                    <button
                        key={park.value}
                        type="button"
                        className="rounded-xl border p-6 transition hover:-translate-y-1 hover:shadow-lg focus-visible:ring-2"
                        onClick={() => onSelect(park)}
                    >
                        {park.label}
                    </button>
                ))}
            </div>
        </>
    );
}
