import { Link } from '@inertiajs/react';
import { InstagramIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';
import {
    cookiePolicy,
    privacyPolicy,
    termsAndConditions,
} from '@/routes/legal';

export function PublicFooter({
    className,
    ...props
}: ComponentProps<'footer'>) {
    return (
        <footer
            className={cn(
                'border-t border-black/10 bg-black/5 text-sm text-gray-700',
                className,
            )}
            {...props}
        >
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                <p>Color Fun Parks</p>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                    <nav
                        aria-label="Informação legal"
                        className="flex flex-wrap gap-x-5 gap-y-2"
                    >
                        <Link
                            href={privacyPolicy()}
                            className="underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:outline-none"
                        >
                            Política de Privacidade
                        </Link>
                        <Link
                            href={termsAndConditions()}
                            className="underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:outline-none"
                        >
                            Termos e Condições
                        </Link>
                        <Link
                            href={cookiePolicy()}
                            className="underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:outline-none"
                        >
                            Política de Cookies
                        </Link>
                    </nav>

                    <a
                        href="https://www.instagram.com/colorpartyfunpark/"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="Instagram da Color Fun Parks"
                        className="inline-flex size-9 items-center justify-center rounded-full border border-black/15 transition-colors hover:bg-black/10 focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:outline-none"
                    >
                        <InstagramIcon className="size-5" aria-hidden="true" />
                        <span className="sr-only">
                            Instagram da Color Fun Parks
                        </span>
                    </a>
                </div>
            </div>
        </footer>
    );
}
