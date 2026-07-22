import { createPartyChild } from '@/components/book-party/party-child';
import type {
    BookingData,
    Park,
    PartyChild,
    PartyChildField,
} from '@/components/book-party/types';

export type BookingAction =
    | {
          type: 'park.selected';
          park: Park;
      }
    | {
          type: 'child.added';
          child: PartyChild;
      }
    | {
          type: 'child.removed';
          childId: string;
      }
    | {
          type: 'child.changed';
          childId: string;
          field: PartyChildField;
          value: string;
      }
    | {
          type: 'email.changed';
          value: string;
      }
    | {
          type: 'guests.changed';
          value: string;
      }
    | {
          type: 'partyDate.changed';
          value: string;
      };

function assertNever(action: never): never {
    throw new Error(`Unhandled booking action: ${JSON.stringify(action)}`);
}

export function createInitialBookingData(): BookingData {
    return {
        park: null,
        children: [createPartyChild()],
        email: '',
        guests: '',
        partyDate: '',
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
        case 'child.added':
            return {
                ...state,
                children: [...state.children, action.child],
            };
        case 'child.removed':
            if (state.children.length === 1) {
                return state;
            }

            return {
                ...state,
                children: state.children.filter(
                    (child) => child.id !== action.childId,
                ),
            };
        case 'child.changed':
            return {
                ...state,
                children: state.children.map((child) =>
                    child.id === action.childId
                        ? {
                              ...child,
                              [action.field]: action.value,
                          }
                        : child,
                ),
            };
        case 'email.changed':
            return {
                ...state,
                email: action.value,
            };
        case 'guests.changed':
            return {
                ...state,
                guests: action.value,
            };
        case 'partyDate.changed':
            return {
                ...state,
                partyDate: action.value,
            };

        default:
            return assertNever(action);
    }
}
