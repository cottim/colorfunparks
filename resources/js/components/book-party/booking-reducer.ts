import { createPartyChild } from '@/components/book-party/party-child';
import type {
    BookingData,
    ContactField,
    Park,
    PartyChildField,
    PartyDetailsField,
    PartyProgram,
} from '@/components/book-party/types';

export type BookingAction =
    | {
          type: 'park.selected';
          park: Park;
      }
    | {
          type: 'contact.changed';
          field: ContactField;
          value: string | boolean;
      }
    | {
          type: 'child.changed';
          field: PartyChildField;
          value: string;
      }
    | {
          type: 'party.changed';
          field: PartyDetailsField;
          value: string;
      }
    | {
          type: 'program.selected';
          program: PartyProgram;
      };

function assertNever(action: never): never {
    throw new Error(`Unhandled booking action: ${JSON.stringify(action)}`);
}

export function createInitialBookingData(): BookingData {
    return {
        contact: {
            name: '',
            email: '',
            phone: '',
            privacyAccepted: false,
            termsAccepted: false,
            marketingAccepted: false,
        },
        park: null,
        child: createPartyChild(),
        guests: '',
        partyDate: '',
        partyTime: '',
        program: null,
    };
}

export function bookingReducer(
    state: BookingData,
    action: BookingAction,
): BookingData {
    switch (action.type) {
        case 'park.selected':
            return {
                ...state,
                park: action.park,
            };
        case 'contact.changed':
            return {
                ...state,
                contact: {
                    ...state.contact,
                    [action.field]: action.value,
                },
            };
        case 'child.changed':
            return {
                ...state,
                child: {
                    ...state.child,
                    [action.field]: action.value,
                },
            };
        case 'party.changed':
            return {
                ...state,
                [action.field]: action.value,
            };
        case 'program.selected':
            return {
                ...state,
                program: action.program,
            };

        default:
            return assertNever(action);
    }
}
