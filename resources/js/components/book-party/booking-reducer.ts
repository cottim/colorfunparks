import { createPartyChild } from '@/components/book-party/party-child';
import type {
    BookingData,
    AuthenticatedCustomer,
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
      }
    | {
          type: 'program.choice.selected';
          group: string;
          choice: string;
      };

function assertNever(action: never): never {
    throw new Error(`Unhandled booking action: ${JSON.stringify(action)}`);
}

export function createInitialBookingData(
    program: PartyProgram | null = null,
    programChoices: Record<string, string> = {},
    authenticatedCustomer: AuthenticatedCustomer | null = null,
): BookingData {
    return {
        contact: {
            name: authenticatedCustomer?.name ?? '',
            email: authenticatedCustomer?.email ?? '',
            phone: '',
            privacyAccepted:
                authenticatedCustomer?.hasAcceptedLegalConsent ?? false,
            termsAccepted:
                authenticatedCustomer?.hasAcceptedLegalConsent ?? false,
            marketingAccepted:
                authenticatedCustomer?.marketing.isAuthorized ?? false,
        },
        park: null,
        child: createPartyChild(),
        guests: '',
        partyDate: '',
        partyTime: '',
        program,
        programChoices,
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
                programChoices:
                    state.program?.value === action.program.value
                        ? state.programChoices
                        : {},
            };
        case 'program.choice.selected':
            return {
                ...state,
                programChoices: {
                    ...state.programChoices,
                    [action.group]: action.choice,
                },
            };

        default:
            return assertNever(action);
    }
}
