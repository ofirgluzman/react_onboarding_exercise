import React, { useState } from 'react';
import { clsx } from 'clsx';
import { isEqual } from 'lodash';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useUser, useUpdateUser } from '../hooks/useUsers';
import styles from './UserEditForm.module.css';
import sharedStyles from '../styles/shared.module.css';
import {
  type FieldsDescriptors,
  type FieldIdentifier,
  fieldDescriptors,
  fieldIdentifiers,
} from './UserEditFormFieldsDescriptors';
import { useStore } from 'zustand';
import { useShallow } from 'zustand/shallow';
import { store } from './UserEditFormStore';

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

const UserEditForm: React.FC = () => {
  const { id: userId } = useParams<{ id: string }>();

  if (!userId) {
    return <Navigate to="/" replace />;
  }

  return <UserEditFormContent userId={userId} />
}

const UserEditFormContent: React.FC<{ userId: string }> = ({ userId }) => {
  const navigate = useNavigate();
  const userResult = useUser(userId);
  const updateUserMutation = useUpdateUser(userId);
  
  const { 
    fieldsInfo, 
    shouldShowMoreDetails, 
    onUserLoaded, 
    onFieldNameChanged, 
    onShowMoreDetailsButtonPressed 
  } = useStore(store, useShallow((state) => {
    return {
      fieldsInfo: state.fieldsInfo,
      shouldShowMoreDetails: state.shouldShowMoreDetails,
      onUserLoaded: state.onUserLoaded,
      onFieldNameChanged: state.onFieldNameChanged,
      onShowMoreDetailsButtonPressed: state.onShowMoreDetailsButtonPressed,
    };
  }));

  useDeepCompareEffect(() => {
    if (userResult.type === 'success') {
      const user = userResult.data;
      onUserLoaded(user);
    }
  }, [userResult, onUserLoaded]);

  if (!userId) {
    return null;
  }
  
  if (userResult.type === 'loading') {
    return (
      <div className={styles.container}>
        <div className="loading-state">Loading user details...</div>
      </div>
    );
  }
  
  if (userResult.type === 'error') {
    return (
      <div className={styles.container}>
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
    !isEqual(fieldsInfo, fieldDescriptors.getFieldsInfoFromUser(userResult.data));

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
      fieldDescriptors.getUserPatchFromFieldsInfo(fieldsInfo),
      {
        onSuccess: () => {
          navigate(`/user/${userId}`);
        },
        onError: (error) => {
          alert('Failed to update user: ' + error.message);
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
    navigate(`/user/${userId}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit(e as React.FormEvent);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFieldNameChanged(name as FieldIdentifier, value);
  };

  return (
    <div className={styles.container} onKeyDown={handleKeyDown}>
      <div className={styles.header}>
        <h1 className={sharedStyles.mediumTitle}>User Form</h1>
        <div className={styles.actions}>
          <button
            type="button"
            className={sharedStyles.secondaryButton}
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="user-form"
            className={sharedStyles.primaryButton}
            disabled={!isValidForSubmission}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <form id="user-form" className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.fields}>
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
          className={styles.addMoreButton}
          onClick={onShowMoreDetailsButtonPressed}
        >
          {shouldShowMoreDetails ? 'Hide Additional Details' : 'Add More Details'}
        </button>
        {shouldShowMoreDetails && (
          <div className={styles.additionalFields}>
            <h3 className={styles.additionalFieldsTitle}>Additional Details</h3>
            <div className={styles.fields}>
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
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
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
    case 'select': {
      const selectDescriptor = descriptor.uiFieldDescriptor;
      return (
        <SelectField
          name={descriptor.name}
          label={descriptor.label}
          value={value}
          onChange={onChange}
          options={selectDescriptor.options}
          placeholder={selectDescriptor.placeholder}
          required={descriptor.required}
          errorMessage={errorMessage || undefined}
        />
      );
    }
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
    <div className={styles.imageField}>
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
        <div className={styles.imagePreview}>
          {imagePreviewError ? (
            <div className={styles.imagePreviewError}>
              Unable to load image from the provided URL
            </div>
          ) : (
            <img
              src={url}
              alt="Profile preview"
              className={styles.imagePreviewImg}
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
  return (
    <div className={styles.inputField}>
      <label htmlFor={name} className={styles.inputLabel}>
        {label}
        {required && <span className={styles.required}> *</span>}
      </label>
      <input
        type={inputType}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={clsx(
          styles.input,
          errorMessage && styles.inputError
        )}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        step={step}
        aria-describedby={errorMessage ? `${name}-error` : undefined}
      />
      {errorMessage && (
        <span id={`${name}-error`} className={styles.inputErrorLabel} role="alert">
          {errorMessage}
        </span>
      )}
    </div>
  );
};

interface SelectFieldProps {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  required: boolean;
  errorMessage?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
  errorMessage
}) => {
  return (
    <div className={styles.inputField}>
      <label htmlFor={name} className={styles.inputLabel}>
        {label}
        {required && <span className={styles.required}> *</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={clsx(
          styles.input,
          errorMessage && styles.inputError
        )}
        required={required}
        aria-describedby={errorMessage ? `${name}-error` : undefined}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {errorMessage && (
        <span id={`${name}-error`} className={styles.inputErrorLabel} role="alert">
          {errorMessage}
        </span>
      )}
    </div>
  );
};

export default UserEditForm;