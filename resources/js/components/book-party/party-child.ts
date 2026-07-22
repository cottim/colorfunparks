import type { PartyChild } from '@/components/book-party/types';

export function createPartyChild(): PartyChild {
    return {
        id: crypto.randomUUID(),
        name: '',
        birthDate: '',
    };
}
