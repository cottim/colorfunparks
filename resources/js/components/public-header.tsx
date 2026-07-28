import { Link, usePage } from '@inertiajs/react';
import { CircleUserRoundIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import AnimatedColorFunParksLogo from '@/components/animated-color-fun-parks-logo';
import { home, login } from '@/routes';
import { index as account } from '@/routes/account';
import { index as management } from '@/routes/management';

type PublicHeaderProps = {
    children?: ReactNode;
};

export function PublicHeader({ children }: PublicHeaderProps) {
    const user = usePage().props.auth.user;
    const isInternalUser = user?.role === 'staff' || user?.role === 'admin';
    const accountHref = !user
        ? login()
        : isInternalUser
          ? management()
          : account();
    const accountLabel = !user
        ? 'Entrar'
        : isInternalUser
          ? 'Gestão'
          : 'Minha conta';

    return (
        <header className="border-b border-black/10">
            <nav
                aria-label="Navegação principal"
                className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:px-8"
            >
                <Link
                    href={home()}
                    aria-label="Color Fun Parks"
                    className="min-w-0"
                >
                    <AnimatedColorFunParksLogo className="w-full max-w-44 overflow-visible sm:max-w-3xs" />
                </Link>

                <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                    <Link
                        href={accountHref}
                        aria-label={accountLabel}
                        title={accountLabel}
                        prefetch
                        className="inline-flex size-10 shrink-0 items-center justify-center gap-2 rounded-full border border-black/15 bg-white/60 font-semibold text-[#376b50] transition-colors hover:bg-white/85 focus-visible:ring-2 focus-visible:ring-[#376b50] focus-visible:ring-offset-2 focus-visible:outline-none sm:w-auto sm:px-3"
                    >
                        <CircleUserRoundIcon
                            className="size-5"
                            aria-hidden="true"
                        />
                        <span className="hidden text-sm sm:inline">
                            {accountLabel}
                        </span>
                    </Link>

                    {children}
                </div>
            </nav>
        </header>
    );
}
