import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import { 
  type FieldsInfo, 
  fieldDescriptors 
} from './UserEditFormFieldsDescriptors';

interface ComponentState {
  userId: string | null;
  fieldsInfo: FieldsInfo;
  shouldShowMoreDetails: boolean;
  hasPreviousEditingHistory: boolean;

  // Actions
  onUserLoaded: (user: User) => void;
  onFieldNameChanged: (fieldName: keyof FieldsInfo, value: string) => void;
  onShowMoreDetailsButtonPressed: () => void;
}

export const store = create<ComponentState>()(
  persist(
    (set) => ({
      userId: null,
      fieldsInfo: fieldDescriptors.getDefaultFieldsInfo(),
      shouldShowMoreDetails: false,
      hasPreviousEditingHistory: false,

      onUserLoaded: (user: User) => {
        set((state) => { 
          // Don't override editing history when original user data is loaded.
          if (state.hasPreviousEditingHistory && state.userId === user.id) {
            return state;
          }
          
          return {
            userId: user.id,
            fieldsInfo: fieldDescriptors.getFieldsInfoFromUser(user)
          };
        });
      },
      onFieldNameChanged: (fieldName: keyof FieldsInfo, value: string) => {
        set((state) => ({
          fieldsInfo: {
            ...state.fieldsInfo,
            [fieldName]: value,
          },
        }));
      },

      onShowMoreDetailsButtonPressed: () => {
        set((state) => ({ shouldShowMoreDetails: !state.shouldShowMoreDetails }));
      }
    }),
    {
      name: `user-edit-form`,
      partialize: (state) => ({
        userId: state.userId,
        fieldsInfo: state.fieldsInfo,
        shouldShowMoreDetails: state.shouldShowMoreDetails,
      }),
      merge: (persistedState, currentState) => {
        if (!persistedState) {
          return currentState;
        }
        const persisted = persistedState as Partial<ComponentState>;
        if (currentState.userId && persisted.userId !== currentState.userId) {
          return currentState;
        }
        return {
          ...currentState,
          userId: persisted.userId || currentState.userId,
          hasPreviousEditingHistory: true,
          fieldsInfo: persisted.fieldsInfo || currentState.fieldsInfo,
          shouldShowMoreDetails: persisted.shouldShowMoreDetails || currentState.shouldShowMoreDetails,
        };
      }
    }
  )
);
