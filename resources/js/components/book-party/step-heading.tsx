import { useEffect, useRef } from 'react';
import type { ComponentProps } from 'react';

type StepHeadingProps = Omit<ComponentProps<'h2'>, 'ref' | 'tabIndex'>;

export function StepHeading({ children, ...props }: StepHeadingProps) {
    const headingRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        headingRef.current?.focus();
    }, []);

    return (
        <h2 {...props} ref={headingRef} tabIndex={-1}>
            {children}
        </h2>
    );
}
