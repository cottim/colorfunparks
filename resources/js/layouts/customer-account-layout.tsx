import { Link, usePage } from '@inertiajs/react';
import {
    CalendarDaysIcon,
    HomeIcon,
    LogOutIcon,
    MailCheckIcon,
    PartyPopperIcon,
    UserRoundIcon,
} from 'lucide-react';
import type { ComponentType, ReactNode } from 'react';
import AnimatedColorFunParksLogo from '@/components/animated-color-fun-parks-logo';
import { PublicFooter } from '@/components/public-footer';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { logout } from '@/routes';
import account from '@/routes/account';
import { create as createPartyBooking } from '@/routes/party-bookings';

type AccountNavigationItem = {
    label: string;
    shortLabel: string;
    href: ReturnType<typeof account.index>;
    icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
    isActive: (path: string) => boolean;
};

const navigationItems: AccountNavigationItem[] = [
    {
        label: 'Visão geral',
        shortLabel: 'Início',
        href: account.index(),
        icon: HomeIcon,
        isActive: (path) => path === account.index.url(),
    },
    {
        label: 'As minhas festas',
        shortLabel: 'Festas',
        href: account.bookings.index(),
        icon: CalendarDaysIcon,
        isActive: (path) => path.startsWith(account.bookings.index.url()),
    },
    {
        label: 'Dados pessoais',
        shortLabel: 'Perfil',
        href: account.profile.edit(),
        icon: UserRoundIcon,
        isActive: (path) => path.startsWith(account.profile.edit.url()),
    },
    {
        label: 'Preferências',
        shortLabel: 'Preferências',
        href: account.preferences.edit(),
        icon: MailCheckIcon,
        isActive: (path) => path.startsWith(account.preferences.edit.url()),
    },
];

export default function CustomerAccountLayout({
    children,
}: {
    children: ReactNode;
}) {
    const { url, props } = usePage();
    const currentPath = url.split('?')[0];

    return (
        <div className="flex min-h-svh flex-col bg-[#fffdf0] text-gray-900">
            <header className="border-b border-black/10 bg-linear-to-r from-[#FFFE00] to-[#FFCD00]">
                <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
                    <Link href={account.index()} aria-label="Ir para a conta">
                        <AnimatedColorFunParksLogo className="w-full max-w-48 overflow-visible sm:max-w-3xs" />
                    </Link>

                    <Button
                        variant="outline"
                        className="rounded-full border-black/15 bg-white/70 text-gray-900 hover:bg-white"
                        asChild
                    >
                        <Link href={logout()} method="post" as="button">
                            <LogOutIcon aria-hidden="true" />
                            <span className="hidden sm:inline">
                                Terminar sessão
                            </span>
                            <span className="sm:hidden">Sair</span>
                        </Link>
                    </Button>
                </div>
            </header>

            <div className="mx-auto grid w-full max-w-7xl flex-1 lg:grid-cols-[16rem_minmax(0,1fr)]">
                <aside className="hidden border-r border-black/10 bg-white/45 px-5 py-8 lg:block">
                    <div className="sticky top-8">
                        <p className="truncate text-sm font-semibold text-[#376b50]">
                            {props.auth.user.email}
                        </p>

                        <nav
                            aria-label="Área de cliente"
                            className="mt-7 space-y-1"
                        >
                            {navigationItems.map((item) => (
                                <AccountNavigationLink
                                    key={item.label}
                                    item={item}
                                    currentPath={currentPath}
                                />
                            ))}
                        </nav>

                        <Button
                            className="mt-8 w-full rounded-xl bg-[#558b6e] text-white hover:bg-[#376b50]"
                            asChild
                        >
                            <Link href={createPartyBooking()}>
                                <PartyPopperIcon aria-hidden="true" />
                                Marcar uma festa
                            </Link>
                        </Button>
                    </div>
                </aside>

                <main className="min-w-0 px-4 py-8 pb-28 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
                    {children}
                </main>
            </div>

            <PublicFooter className="mb-20 lg:mb-0" />

            <nav
                aria-label="Área de cliente"
                className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-black/10 bg-white/95 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur lg:hidden"
            >
                {navigationItems.map((item) => (
                    <AccountNavigationLink
                        key={item.label}
                        item={item}
                        currentPath={currentPath}
                        mobile
                    />
                ))}
            </nav>
        </div>
    );
}

function AccountNavigationLink({
    item,
    currentPath,
    mobile = false,
}: {
    item: AccountNavigationItem;
    currentPath: string;
    mobile?: boolean;
}) {
    const isActive = item.isActive(currentPath);
    const Icon = item.icon;

    return (
        <Link
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
                'transition-colors focus-visible:ring-2 focus-visible:ring-[#376b50] focus-visible:outline-none',
                mobile
                    ? 'flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[0.6875rem] font-semibold'
                    : 'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold',
                isActive
                    ? 'bg-[#558b6e]/12 text-[#28583f]'
                    : 'text-gray-600 hover:bg-black/5 hover:text-gray-900',
            )}
        >
            <Icon
                className={cn(mobile ? 'size-5' : 'size-4.5')}
                aria-hidden={true}
            />
            <span className={cn(mobile && 'truncate')}>
                {mobile ? item.shortLabel : item.label}
            </span>
        </Link>
    );
}
