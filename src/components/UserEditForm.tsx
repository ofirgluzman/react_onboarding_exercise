import React, { useState, useRef } from 'react';
import { isEqual } from 'lodash';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser, useUpdateUser, type UserPatch } from '../hooks/useUsers';
import type { User } from '../types';
import './UserEditForm.css';

interface FieldsInfo {
  firstName: string;
  lastName: string;
  age: string;
  email: string;
  gender: string;
  city: string;
  state: string;
  country: string;
  image: string;
  birthDate: string;
  bloodGroup: string;
  height: string;
  weight: string;
  eyeColor: string;
}

type FieldIdentifier = keyof FieldsInfo;
type ErrorMessage = string;

type UIInputFieldDescriptor = 
  { type: 'text', placeholder: string } |
  { type: 'number', min: number, max: number, step?: number } |
  { type: 'email', placeholder: string } |
  { type: 'date' };
type UIFieldDescriptor = 
  { type: 'input', descriptor: UIInputFieldDescriptor } |
  { type: 'image', urlPlaceholder: string };
  
interface FieldDescriptor<T extends FieldIdentifier> {
  name: T;
  getFromUser: (user: User) => FieldsInfo[T];
  setOnUserPatch: (user: UserPatch, value: FieldsInfo[T]) => void;
  defaultValue: FieldsInfo[T];
  validate: (value: FieldsInfo[T]) => ErrorMessage | null;
  required: boolean;
  label: string;
  uiFieldDescriptor: UIFieldDescriptor;
}

type FieldsDescriptors = {
  [K in FieldIdentifier]: FieldDescriptor<K>;
};

const fieldDescriptors: FieldsDescriptors = {
  firstName: {
    name: 'firstName',
    getFromUser: (user) => user.firstName,
    setOnUserPatch: (user, value) => { user.firstName = value; },
    defaultValue: '',
    required: true,
    validate: (value) => {
      if (!value.trim()) return 'First name is required';
      if (value.length > 80) return 'First name must be less than 80 characters';
      return null;
    },
    label: 'First Name',
    uiFieldDescriptor: { type: 'input', descriptor: { type: 'text', placeholder: 'Olivia' } },
  },
  lastName: {
    name: 'lastName',
    getFromUser: (user) => user.lastName,
    setOnUserPatch: (user, value) => { user.lastName = value; },
    defaultValue: '',
    required: false,
    validate: (value) => {
      if (value.length > 80) return 'Last name must be less than 80 characters';
      return null;
    },
    label: 'Last Name',
    uiFieldDescriptor: { type: 'input', descriptor: { type: 'text', placeholder: 'Johnson' } },
  },
  age: {
    name: 'age',
    getFromUser: (user) => user.age.toString(),
    setOnUserPatch: (user, value) => { user.age = parseInt(value, 10); },
    defaultValue: '',
    required: true,
    validate: (value) => {
      if (!value.trim()) return 'Age is required';
      const ageNum = parseInt(value);
      if (isNaN(ageNum) || ageNum < 0 || ageNum > 120) return 'Age must be between 0 and 120';
      return null;
    },
    label: 'Age',
    uiFieldDescriptor: { type: 'input', descriptor: { type: 'number', min: 0, max: 120 } },
  },
  email: {
    name: 'email',
    getFromUser: (user) => user.email,
    setOnUserPatch: (user, value) => { user.email = value; },
    defaultValue: '',
    required: true,
    validate: (value) => {
      if (!value.trim()) return 'Email is required';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return 'Please enter a valid email';
      return null;
    },
    label: 'Email',
    uiFieldDescriptor: { type: 'input', descriptor: { type: 'email', placeholder: 'olivia@example.com' } },
  },
  gender: {
    name: 'gender',
    getFromUser: (user) => user.gender || '',
    setOnUserPatch: (user, value) => { user.gender = value; },
    defaultValue: '',
    required: true,
    validate: (value) => {
      if (!value.trim()) return 'Gender is required';
      if (value.length > 80) return 'Gender must be less than 80 characters';
      return null;
    },
    label: 'Gender',
    uiFieldDescriptor: { type: 'input', descriptor: { type: 'text', placeholder: 'Female' } },
  },
  city: {
    name: 'city',
    getFromUser: (user) => user.address.city,
    setOnUserPatch: (user, value) => { 
      if (!user.address) {
        user.address = {}
      }
      user.address.city = value; 
    },
    defaultValue: '',
    required: true,
    validate: (value) => {
      if (!value.trim()) return 'City is required';
      if (value.length > 80) return 'City must be less than 80 characters';
      return null;
    },
    label: 'City',
    uiFieldDescriptor: { type: 'input', descriptor: { type: 'text', placeholder: 'Fort Worth' } },
  },
  state: {
    name: 'state',
    getFromUser: (user) => user.address.state,
    setOnUserPatch: (user, value) => {
      if (!user.address) {
        user.address = {}
      }
      user.address.state = value;
    },
    defaultValue: '',
    required: true,
    validate: (value) => {
      if (!value.trim()) return 'State is required';
      if (value.length > 80) return 'State must be less than 80 characters';
      return null;
    },
    label: 'State',
    uiFieldDescriptor: { type: 'input', descriptor: { type: 'text', placeholder: 'Texas' } },
  },
  country: {
    name: 'country',
    getFromUser: (user) => user.address.country || '',
    setOnUserPatch: (user, value) => {
      if (!user.address) {
        user.address = {}
      }
      user.address.country = value;
    },
    defaultValue: '',
    required: true,
    validate: (value) => {
      if (!value.trim()) return 'Country is required';
      if (value.length > 80) return 'Country must be less than 80 characters';
      return null;
    },
    label: 'Country',
    uiFieldDescriptor: { type: 'input', descriptor: { type: 'text', placeholder: 'United States' } },
  },
  image: {
    name: 'image',
    getFromUser: (user) => user.image,
    setOnUserPatch: (user, value) => { user.image = value; },
    defaultValue: '',
    required: true,
    validate: (value) => {
      if (!value.trim()) return 'Profile image URL is required';
      try {
        new URL(value);
        if (!value.startsWith('http://') && !value.startsWith('https://')) {
          return 'Profile image must be a valid URL (http/https)';
        }
      } catch {
        return 'Profile image must be a valid URL';
      }
      return null;
    },
    label: 'Profile Image URL',
    uiFieldDescriptor: { type: 'image', urlPlaceholder: 'https://example.com/image.jpg' },
  },
  birthDate: {
    name: 'birthDate',
    getFromUser: (user) => user.birthDate || '',
    setOnUserPatch: (user, value) => { user.birthDate = value; },
    defaultValue: '',
    required: false,
    validate: () => null,
    label: 'Birth Date',
    uiFieldDescriptor: { type: 'input', descriptor: { type: 'date' } },
  },
  bloodGroup: {
    name: 'bloodGroup',
    getFromUser: (user) => user.bloodGroup || '',
    setOnUserPatch: (user, value) => { user.bloodGroup = value; },
    defaultValue: '',
    required: false,
    validate: () => null,
    label: 'Blood Group',
    uiFieldDescriptor: { type: 'input', descriptor: { type: 'text', placeholder: 'O+' } },
  },
  height: {
    name: 'height',
    getFromUser: (user) => user.height || '',
    setOnUserPatch: (user, value) => { user.height = value; },
    defaultValue: '',
    required: false,
    validate: () => null,
    label: 'Height (cm)',
    uiFieldDescriptor: { type: 'input', descriptor: { type: 'number', min: 0, max: 300, step: 0.1 } },
  },
  weight: {
    name: 'weight',
    getFromUser: (user) => user.weight || '',
    setOnUserPatch: (user, value) => { user.weight = value; },
    defaultValue: '',
    required: false,
    validate: () => null,
    label: 'Weight (kg)',
    uiFieldDescriptor: { type: 'input', descriptor: { type: 'number', min: 0, max: 500 } },
  },
  eyeColor: {
    name: 'eyeColor',
    getFromUser: (user) => user.eyeColor || '',
    setOnUserPatch: (user, value) => { user.eyeColor = value; },
    defaultValue: '',
    required: false,
    validate: () => null,
    label: 'Eye Color',
    uiFieldDescriptor: { type: 'input', descriptor: { type: 'text', placeholder: 'Brown' } },
  },
};

const fieldIdentifiers = Object.keys(fieldDescriptors) as Array<FieldIdentifier>;

const getDefaultFieldsInfo = (): FieldsInfo => {
  return fieldIdentifiers.reduce((acc, key) => {
    acc[key] = fieldDescriptors[key].defaultValue;
    return acc;
  }, {} as FieldsInfo);
};

const getFieldsInfoFromUser = (user: User): FieldsInfo => {
  return fieldIdentifiers.reduce((acc, key) => {
    acc[key] = fieldDescriptors[key].getFromUser(user);
    return acc;
  }, {} as FieldsInfo);
};

const getUserPatchFromFieldsInfo = (fieldsInfo: FieldsInfo): UserPatch => {
  return fieldIdentifiers.reduce((acc, key) => {
    fieldDescriptors[key].setOnUserPatch(acc, fieldsInfo[key]);
    return acc;
  }, {} as UserPatch);
};


const uiFieldIdentifiers = {
  main: ['firstName', 'lastName', 'age', 'email', 'gender', 'city', 'state', 'country', 'image'] as const,
  additional: ['birthDate', 'bloodGroup', 'height', 'weight', 'eyeColor'] as const
};

// The following code is used to ensure the UI field identifiers set match exactly 
// the field identifiers set at compile time.
(() => {
  type UIFieldIdentifier = 
    typeof uiFieldIdentifiers.main[number] | 
    typeof uiFieldIdentifiers.additional[number];

  // If this code fails to compile, you have a missing field in the UI field identifiers set.
  type MissingFields = Exclude<FieldIdentifier, UIFieldIdentifier>;
  const _checkedMissingFields: MissingFields extends never ? true : false = true;
  void _checkedMissingFields; // Silence unused variable error.

  // If this code fails to compile, one of the UI field identifiers is not covered by the field 
  // identifiers set.
  type ExtraFields = Exclude<UIFieldIdentifier, FieldIdentifier>;
  const _checkedExtraFields: ExtraFields extends never ? true : false = true;
  void _checkedExtraFields; // Silence unused variable error.
})();

interface ComponentState {
  userId: string;
  fieldsInfo: FieldsInfo;
  shouldShowMoreDetails: boolean;
  hasPreviousEditingHistory: boolean;

  // Actions
  onUserLoaded: (user: User) => void;
  onFieldNameChanged: (fieldName: keyof FieldsInfo, value: string) => void;
  onShowMoreDetailsButtonPressed: () => void;
}

function makeComponentStore(
  userId: string, initialFieldsInfo: FieldsInfo, storageInstanceId: string
) {
  return create<ComponentState>()(
    persist(
      (set) => ({
        userId: userId,
        fieldsInfo: initialFieldsInfo,
        shouldShowMoreDetails: false,
        hasPreviousEditingHistory: false,

        onUserLoaded: (user: User) => {
          set((state) => { 
            // Don't override editing history when original user data is loaded.
            if (state.hasPreviousEditingHistory) {
              return state;
            }
            
            return {
              fieldsInfo: getFieldsInfoFromUser(user)
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
        name: `user-edit-form-${storageInstanceId}`,
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
          if (persisted.userId !== currentState.userId) {
            return currentState;
          }
          return {
            ...currentState,
            hasPreviousEditingHistory: true,
            fieldsInfo: persisted.fieldsInfo || currentState.fieldsInfo,
            shouldShowMoreDetails: persisted.shouldShowMoreDetails || currentState.shouldShowMoreDetails,
          };
        }
      }
    )
  );
}

type UserEditFormProps = {
  instanceId: string;
}

const UserEditForm: React.FC<UserEditFormProps> = ({instanceId}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userResult = useUser(id || '');
  const updateUserMutation = useUpdateUser(id || '');
  
  const initialFieldsInfo = userResult.type === 'success' 
    ? getFieldsInfoFromUser(userResult.data)
    : getDefaultFieldsInfo();
  const storeRef = useRef<ReturnType<typeof makeComponentStore> | undefined>(undefined);
  if (!storeRef.current) storeRef.current = makeComponentStore(
    id || '', initialFieldsInfo, instanceId
  );
  const useStore = storeRef.current!;

  const fieldsInfo = useStore(state => state.fieldsInfo);
  const shouldShowMoreDetails = useStore(state => state.shouldShowMoreDetails);
  const onUserLoaded = useStore(state => state.onUserLoaded);
  const onFieldNameChanged = useStore(state => state.onFieldNameChanged);
  const onShowMoreDetailsButtonPressed = useStore(state => state.onShowMoreDetailsButtonPressed);

  useDeepCompareEffect(() => {
    if (userResult.type === 'success') {
      const user = userResult.data;
      onUserLoaded(user);
    }
  }, [userResult, onUserLoaded]);

  if (!id) {
    return null;
  }
  
  if (userResult.type === 'loading') {
    return (
      <div className="user-edit-form">
        <div className="loading-state">Loading user details...</div>
      </div>
    );
  }
  
  if (userResult.type === 'error') {
    return (
      <div className="user-edit-form">
        <div className="error-state">Error loading user details</div>
      </div>
    );
  }

  const hasAllRequiredFields = fieldIdentifiers
    .filter(
      identifier => fieldDescriptors[identifier].required
    ).every(
      identifier => fieldsInfo[identifier].trim().length > 0
    );
  const hasErrors = fieldIdentifiers.some(
    identifier => fieldDescriptors[identifier].validate(fieldsInfo[identifier]) !== null
  );
  const isSaving = updateUserMutation.isPending;
  const hasPendingChanges = 
    !isEqual(fieldsInfo, getFieldsInfoFromUser(userResult.data));

  const isValidForSubmission = 
    hasAllRequiredFields && 
    !hasErrors && 
    !isSaving &&
    hasPendingChanges;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidForSubmission) {
      return;
    }
    
    if (userResult.type !== 'success') {
      return;
    }

    updateUserMutation.mutate(
      getUserPatchFromFieldsInfo(fieldsInfo),
      {
        onSuccess: () => {
          navigate(`/user/${id}`);
        },
        onError: (error) => {
          alert('Failed to update user: ' + error.message);
          navigate(`/user/${id}`);
        }
      }
    );
  };

  const handleCancel = () => {
    if (hasPendingChanges) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to leave without saving?'
      );
      if (!confirmed) {
        return;
      }
    }
    navigate(`/user/${id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit(e as React.FormEvent);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onFieldNameChanged(name as keyof FieldsInfo, value);
  };

  return (
    <div className="user-edit-form" onKeyDown={handleKeyDown}>
      <div className="user-edit-form__header">
        <h1 className="user-edit-form__title">User Form</h1>
        <div className="user-edit-form__actions">
          <button
            type="button"
            className="user-edit-form__cancel-button"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="user-form"
            className="user-edit-form__save-button"
            disabled={!isValidForSubmission}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <form id="user-form" className="user-edit-form__form" onSubmit={handleSubmit}>
        <div className="user-edit-form__fields">
          {uiFieldIdentifiers.main.map(identifier => (
            <FormField
              key={identifier}
              descriptor={fieldDescriptors[identifier]}
              value={fieldsInfo[identifier]}
              onChange={handleInputChange}
            />
          ))}
        </div>

        <button
          type="button"
          className="user-edit-form__add-more-details-button"
          onClick={onShowMoreDetailsButtonPressed}
        >
          {shouldShowMoreDetails ? 'Hide Additional Details' : 'Add More Details'}
        </button>
        {shouldShowMoreDetails && (
          <div className="user-edit-form__additional-fields">
            <h3 className="user-edit-form__additional-fields-title">Additional Details</h3>
            <div className="user-edit-form__fields">
              {uiFieldIdentifiers.additional.map(identifier => (
                <FormField
                  key={identifier}
                  descriptor={fieldDescriptors[identifier]}
                  value={fieldsInfo[identifier]}
                  onChange={handleInputChange}
                />
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

type AnyFieldDescriptor = FieldsDescriptors[FieldIdentifier];

interface FormFieldProps {
  descriptor: AnyFieldDescriptor;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormField: React.FC<FormFieldProps> = ({
  descriptor,
  value,
  onChange,
}) => {
  const errorMessage = descriptor.validate(value);

  switch (descriptor.uiFieldDescriptor.type) {
    case 'image':
      return (
        <ImageField
          name={descriptor.name}
          label={descriptor.label}
          url={value}
          onChange={onChange}
          placeholder={descriptor.uiFieldDescriptor.urlPlaceholder}
          required={descriptor.required}
          errorMessage={errorMessage || undefined}
        />
      );
    case 'input': {
      const inputDescriptor = descriptor.uiFieldDescriptor.descriptor;
      const inputType = inputDescriptor.type;

      return (
        <InputField
           name={descriptor.name}
           label={descriptor.label}
           value={value}
           onChange={onChange}
           inputType={inputType}
           placeholder={
            inputType === 'text' || inputType === 'email' ? 
            inputDescriptor.placeholder : undefined
          }
          required={descriptor.required}
          min={inputDescriptor.type === 'number' ? inputDescriptor.min : undefined}
          max={inputDescriptor.type === 'number' ? inputDescriptor.max : undefined}
          step={inputDescriptor.type === 'number' ? inputDescriptor.step : undefined}
          errorMessage={errorMessage || undefined}
        />
      );
    }
  }
}

interface ImageFieldProps {
  name: string; 
  label: string;
  url: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  errorMessage?: string;
}

const ImageField: React.FC<ImageFieldProps> = ({
  name,
  label,
  url,
  onChange,
  placeholder,
  required = false,
  errorMessage
}) => {
  const [imagePreviewError, setImagePreviewError] = useState(false);

  const handleImageError = () => {
    setImagePreviewError(true);
  };

  const handleImageLoad = () => {
    setImagePreviewError(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImagePreviewError(false);
    onChange(e);
  };

  return (
    <div className="user-edit-form__image-field">
      <InputField
        name={name}
        label={label}
        value={url}
        onChange={handleInputChange}
        inputType="url"
        required={required}
        placeholder={placeholder}
        errorMessage={errorMessage}
      />

      {url && !errorMessage && (
        <div className="user-edit-form__image-preview">
          {imagePreviewError ? (
            <div className="user-edit-form__image-preview-error">
              Unable to load image from the provided URL
            </div>
          ) : (
            <img
              src={url}
              alt="Profile preview"
              className="user-edit-form__image-preview-img"
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          )}
        </div>
      )}
    </div>
  );
};

interface InputFieldProps {
  name: string; 
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputType: string;
  placeholder?: string;
  required: boolean;
  min?: number;
  max?: number;
  step?: number;
  errorMessage?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  label,
  value,
  onChange,
  inputType,
  placeholder,
  required,
  min,
  max,
  step,
  errorMessage
}) => {
  const inputClassNames = [
    'user-edit-form__input-field-input',
    errorMessage ? 'user-edit-form__input-field-input--error' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className="user-edit-form__input-field">
      <label htmlFor={name} className="user-edit-form__input-field-label">
        {label}
        {required && <span className="user-edit-form__required"> *</span>}
      </label>
      <input
        type={inputType}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={inputClassNames}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        step={step}
        aria-describedby={errorMessage ? `${name}-error` : undefined}
      />
      {errorMessage && (
        <span id={`${name}-error`} className="user-edit-form__input-error-label" 
        role="alert">
          {errorMessage}
        </span>
      )}
    </div>
  );
};

export default UserEditForm;