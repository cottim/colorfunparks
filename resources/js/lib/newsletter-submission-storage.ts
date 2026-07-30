export type SavedNewsletterSubmission = {
    status: 'pending' | 'confirmed';
    maskedEmail: string;
    expirationMinutes?: number;
};

const newsletterStorageKey = 'color-fun-parks.newsletter-submission.v3';
const legacyNewsletterStorageKeys = [
    'color-fun-parks.newsletter-submission.v1',
    'color-fun-parks.newsletter-submission.v2',
];
const newsletterSessionEmailKey =
    'color-fun-parks.newsletter-submission-email.v1';
const newsletterStorageEvent = 'newsletter-submission-changed';

export function subscribeToNewsletterStorage(callback: () => void) {
    function handleStorage(event: StorageEvent) {
        if (event.key === newsletterStorageKey) {
            callback();
        }
    }

    window.addEventListener('storage', handleStorage);
    window.addEventListener(newsletterStorageEvent, callback);

    return () => {
        window.removeEventListener('storage', handleStorage);
        window.removeEventListener(newsletterStorageEvent, callback);
    };
}

export function getNewsletterStorageSnapshot() {
    return window.localStorage.getItem(newsletterStorageKey);
}

export function saveNewsletterSubmission(
    submission: SavedNewsletterSubmission,
) {
    window.localStorage.setItem(
        newsletterStorageKey,
        JSON.stringify(submission),
    );
    notifyNewsletterStorageChanged();
}

export function removeNewsletterSubmission() {
    window.localStorage.removeItem(newsletterStorageKey);
    removeLegacyNewsletterSubmission();
    window.sessionStorage.removeItem(newsletterSessionEmailKey);
    notifyNewsletterStorageChanged();
}

export function removeLegacyNewsletterSubmission() {
    legacyNewsletterStorageKeys.forEach((key) =>
        window.localStorage.removeItem(key),
    );
}

export function saveNewsletterSessionEmail(email: string) {
    window.sessionStorage.setItem(newsletterSessionEmailKey, email);
}

export function getNewsletterSessionEmail(): string {
    if (typeof window === 'undefined') {
        return '';
    }

    return window.sessionStorage.getItem(newsletterSessionEmailKey) ?? '';
}

export function parseNewsletterSubmission(
    storedValue: string | null,
): SavedNewsletterSubmission | null {
    if (storedValue === null) {
        return null;
    }

    try {
        const submission: unknown = JSON.parse(storedValue);

        if (
            typeof submission !== 'object' ||
            submission === null ||
            !('status' in submission) ||
            (submission.status !== 'pending' &&
                submission.status !== 'confirmed') ||
            !('maskedEmail' in submission) ||
            typeof submission.maskedEmail !== 'string'
        ) {
            return null;
        }

        return {
            status: submission.status,
            maskedEmail: submission.maskedEmail,
            ...('expirationMinutes' in submission &&
            typeof submission.expirationMinutes === 'number'
                ? { expirationMinutes: submission.expirationMinutes }
                : {}),
        };
    } catch {
        return null;
    }
}

function notifyNewsletterStorageChanged() {
    window.dispatchEvent(new Event(newsletterStorageEvent));
}
