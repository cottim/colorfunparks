import { createInertiaApp } from '@inertiajs/react';
import {
    hasAuthenticatedUser,
    NewsletterBrowserStateBoundary,
} from '@/components/newsletter-browser-state-boundary';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import CustomerLoginLayout from '@/layouts/auth/customer-login-layout';
import AuthLayout from '@/layouts/auth-layout';
import CustomerAccountLayout from '@/layouts/customer-account-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const cspNonce = document.querySelector<HTMLMetaElement>(
    'meta[name="csp-nonce"]',
)?.content;

createInertiaApp({
    nonce: cspNonce,
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
            case name.startsWith('legal/'):
            case name.startsWith('party-bookings/'):
            case name.startsWith('articles/'):
            case name.startsWith('errors/'):
            case name.startsWith('services/'):
            case name.startsWith('color-camp-registrations/'):
                return null;
            case name.startsWith('account/'):
                return CustomerAccountLayout;
            case name === 'auth/login':
                return CustomerLoginLayout;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app, { page }) {
        return (
            <TooltipProvider delayDuration={0}>
                <NewsletterBrowserStateBoundary
                    initiallyAuthenticated={hasAuthenticatedUser(page.props)}
                />
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
