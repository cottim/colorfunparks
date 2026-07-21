import { FerrisWheelIcon } from 'lucide-react';
import type { RefObject } from 'react';
import type { Park } from '@/components/book-party/types';

type ParkStepProps = {
    parks: readonly Park[];
    headingRef: RefObject<HTMLHeadingElement | null>;
    onSelect: (park: Park) => void;
};

export function ParkStep({ parks, headingRef, onSelect }: ParkStepProps) {
    return (
        <>
            <h2
                className="flex items-center gap-2"
                ref={headingRef}
                tabIndex={-1}
            >
                <FerrisWheelIcon />
                Escolhe o teu parque
            </h2>

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
