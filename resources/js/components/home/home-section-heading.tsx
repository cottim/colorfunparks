type HomeSectionHeadingProps = {
    id: string;
    eyebrow: string;
    title: string;
    description: string;
    variant?: 'default' | 'inverse';
};

export function HomeSectionHeading({
    id,
    eyebrow,
    title,
    description,
    variant = 'default',
}: HomeSectionHeadingProps) {
    const isInverse = variant === 'inverse';

    return (
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
            <p
                className={`text-sm font-bold tracking-wide uppercase ${
                    isInverse ? 'text-yellow-200' : 'text-[#376b50]'
                }`}
            >
                {eyebrow}
            </p>
            <h2
                id={id}
                className={`text-3xl font-bold tracking-tight sm:text-4xl ${
                    isInverse ? 'text-white' : 'text-gray-900'
                }`}
            >
                {title}
            </h2>
            <p
                className={`text-base leading-7 sm:text-lg ${
                    isInverse ? 'text-green-50' : 'text-gray-700'
                }`}
            >
                {description}
            </p>
        </div>
    );
}
