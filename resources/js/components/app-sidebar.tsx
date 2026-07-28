import { Link, usePage } from '@inertiajs/react';
import {
    CakeSliceIcon,
    ContactRoundIcon,
    HouseIcon,
    SunIcon,
    UserCogIcon,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { index as managementIndex } from '@/routes/management';
import { index as bookingsIndex } from '@/routes/management/bookings';
import { index as colorCampRegistrationsIndex } from '@/routes/management/color-camp-registrations';
import { index as customersIndex } from '@/routes/management/customers';
import { index as usersIndex } from '@/routes/management/users';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { auth } = usePage().props;
    const isAdministrator = auth.user.role === 'admin';
    const mainNavItems: NavItem[] = [
        {
            title: 'Início',
            href: managementIndex(),
            icon: HouseIcon,
        },
        {
            title: 'Festas',
            href: bookingsIndex(),
            icon: CakeSliceIcon,
        },
        {
            title: 'Color Camp',
            href: colorCampRegistrationsIndex(),
            icon: SunIcon,
        },
        {
            title: 'Clientes',
            href: customersIndex(),
            icon: ContactRoundIcon,
        },
        ...(isAdministrator
            ? [
                  {
                      title: 'Utilizadores',
                      href: usersIndex(),
                      icon: UserCogIcon,
                  },
              ]
            : []),
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={managementIndex()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
