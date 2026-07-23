type HomeSectionHeadingProps = {
    id: string;
    eyebrow: string;
    title: string;
    description: string;
};

export function HomeSectionHeading({
    id,
    eyebrow,
    title,
    description,
}: HomeSectionHeadingProps) {
    return (
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
            <p className="text-sm font-bold tracking-wide text-red-600 uppercase">
                {eyebrow}
            </p>
            <h2
                id={id}
                className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
            >
                {title}
            </h2>
            <p className="text-base leading-7 text-gray-700 sm:text-lg">
                {description}
            </p>
        </div>
    );
}
