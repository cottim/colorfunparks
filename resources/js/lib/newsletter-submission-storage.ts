export type SavedNewsletterSubmission = {
    status: 'pending' | 'confirmed';
    email: string;
    maskedEmail: string;
    expirationMinutes?: number;
};

const newsletterStorageKey = 'color-fun-parks.newsletter-submission.v2';
const legacyNewsletterStorageKey = 'color-fun-parks.newsletter-submission.v1';
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
    window.localStorage.removeItem(legacyNewsletterStorageKey);
    notifyNewsletterStorageChanged();
}

export function removeLegacyNewsletterSubmission() {
    window.localStorage.removeItem(legacyNewsletterStorageKey);
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
            !('email' in submission) ||
            typeof submission.email !== 'string' ||
            !('maskedEmail' in submission) ||
            typeof submission.maskedEmail !== 'string'
        ) {
            return null;
        }

        return submission as SavedNewsletterSubmission;
    } catch {
        return null;
    }
}

function notifyNewsletterStorageChanged() {
    window.dispatchEvent(new Event(newsletterStorageEvent));
}
