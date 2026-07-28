import { BrandMark } from '@/components/brand-mark';

export default function AppLogo() {
    return (
        <>
            <BrandMark
                className="size-8 shrink-0 shadow-xs ring-1 ring-black/10"
                aria-hidden="true"
            />
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    Color Fun Parks
                </span>
            </div>
        </>
    );
}
