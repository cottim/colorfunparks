import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import {
    removeLegacyNewsletterSubmission,
    removeNewsletterSubmission,
} from '@/lib/newsletter-submission-storage';

export function NewsletterBrowserStateBoundary({
    initiallyAuthenticated,
}: {
    initiallyAuthenticated: boolean;
}) {
    useEffect(() => {
        synchronizeNewsletterStorage(initiallyAuthenticated);

        return router.on('navigate', (event) => {
            synchronizeNewsletterStorage(
                hasAuthenticatedUser(event.detail.page.props),
            );
        });
    }, [initiallyAuthenticated]);

    return null;
}

export function hasAuthenticatedUser(props: Record<string, unknown>): boolean {
    if (
        typeof props.auth !== 'object' ||
        props.auth === null ||
        !('user' in props.auth)
    ) {
        return false;
    }

    return props.auth.user !== null;
}

function synchronizeNewsletterStorage(isAuthenticated: boolean) {
    if (isAuthenticated) {
        removeNewsletterSubmission();

        return;
    }

    removeLegacyNewsletterSubmission();
}
