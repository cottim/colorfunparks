import type { ComponentProps } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type CtaButtonProps = Omit<ComponentProps<typeof Button>, 'asChild' | 'variant'> & {
    attention?: 'none' | 'shine';
};

export function CtaButton({
    attention = 'none',
    children,
    className,
    disabled,
    ...props
}: CtaButtonProps) {
    return (
        <Button
            data-slot="cta-button"
            disabled={disabled}
            className={cn(
                'group relative cursor-pointer overflow-hidden bg-red-500 font-semibold text-gray-100 shadow-md',
                'hover:bg-red-500/90 hover:shadow-lg',
                'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                'motion-safe:transition-[color,box-shadow,transform]',
                'motion-safe:hover:-translate-y-px motion-safe:hover:scale-[1.025]',
                'motion-safe:active:translate-y-0 motion-safe:active:scale-[0.975]',
                className,
            )}
            {...props}
        >
            {attention === 'shine' && !disabled && (
                <span
                    aria-hidden="true"
                    className={cn(
                        'pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[200%] skew-x-[-20deg]',
                        'bg-linear-to-r from-transparent via-white/40 to-transparent',
                        'motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out',
                        'motion-safe:group-hover:translate-x-[500%]',
                        'motion-safe:group-focus-visible:translate-x-[500%]',
                    )}
                />
            )}
            <span className="relative z-10 inline-flex items-center gap-2">
                {children}
            </span>
        </Button>
    );
}
