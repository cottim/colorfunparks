import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export function BrandMark({
    className,
    alt = '',
    ...props
}: Omit<ComponentProps<'img'>, 'src'>) {
    return (
        <img
            src="/favicon.svg"
            alt={alt}
            className={cn('rounded-full', className)}
            {...props}
        />
    );
}
