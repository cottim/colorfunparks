import { CheckIcon, FerrisWheelIcon } from 'lucide-react';
import { BookingSection } from '@/components/book-party/booking-section';
import type { BookingSectionWorkflow } from '@/components/book-party/booking-section';
import type { Park } from '@/components/book-party/types';
import InputError from '@/components/input-error';

type ParkSectionProps = {
    parks: readonly Park[];
    selectedPark: Park | null;
    error?: string;
    onSelect: (park: Park) => void;
    workflow: BookingSectionWorkflow;
};

export function ParkSection({
    parks,
    selectedPark,
    error,
    onSelect,
    workflow,
}: ParkSectionProps) {
    return (
        <BookingSection
            number={2}
            title="Escolhe o parque"
            description="Seleciona o parque onde gostarias de realizar a festa."
            workflow={workflow}
        >
            <div className="grid gap-3 sm:grid-cols-3">
                {parks.map((park) => (
                    <button
                        key={park.value}
                        type="button"
                        aria-pressed={selectedPark?.value === park.value}
                        className="relative flex min-h-28 flex-col items-center justify-center gap-3 rounded-xl border border-black/10 p-4 text-center font-semibold transition hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-[#558b6e] focus-visible:outline-none aria-pressed:border-[#558b6e] aria-pressed:bg-[#558b6e]/10"
                        onClick={() => onSelect(park)}
                    >
                        <FerrisWheelIcon className="size-6 text-[#558b6e]" />
                        {park.label}
                        {selectedPark?.value === park.value && (
                            <span className="absolute top-2 right-2 flex size-5 items-center justify-center rounded-full bg-[#558b6e] text-white">
                                <CheckIcon className="size-3" />
                            </span>
                        )}
                    </button>
                ))}
            </div>
            <InputError className="mt-3" message={error} />
        </BookingSection>
    );
}
