import type { LucideIcon } from 'lucide-react';

export function SectionPlaceholder({
    eyebrow,
    title,
    description,
    icon: Icon,
}: {
    eyebrow: string;
    title: string;
    description: string;
    icon: LucideIcon;
}) {
    return (
        <>
            <header>
                <p className="text-sm font-bold tracking-wide text-[#558b6e] uppercase">
                    {eyebrow}
                </p>
                <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                    {title}
                </h1>
                <p className="mt-2 max-w-2xl text-gray-600">{description}</p>
            </header>

            <section className="mt-8 rounded-3xl border border-black/10 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex size-11 items-center justify-center rounded-full bg-[#558b6e]/10 text-[#376b50]">
                    <Icon aria-hidden="true" />
                </div>
                <h2 className="mt-5 text-xl font-black">
                    Esta área é o próximo passo
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600">
                    A navegação já está preparada. Vamos construir este conteúdo
                    sobre a mesma base, sem duplicar o layout do portal.
                </p>
            </section>
        </>
    );
}
