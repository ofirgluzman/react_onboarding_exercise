import type { User } from '../types';
import type { UserPatch } from '../hooks/useUsers';

export interface FieldsInfo {
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

export type FieldIdentifier = keyof FieldsInfo;
type ErrorMessage = string;

type UIInputFieldDescriptor = 
  { type: 'text', placeholder: string } |
  { type: 'number', min: number, max: number, step?: number } |
  { type: 'email', placeholder: string } |
  { type: 'date' };
type UISelectOption = { label: string; value: string };
type UIFieldDescriptor = 
  { type: 'input', descriptor: UIInputFieldDescriptor } |
  { type: 'image', urlPlaceholder: string } |
  { type: 'select', options: UISelectOption[], placeholder?: string };
  
export interface FieldDescriptor<T extends FieldIdentifier> {
  name: T;
  getFromUser: (user: User) => FieldsInfo[T];
  setOnUserPatch: (user: UserPatch, value: FieldsInfo[T]) => void;
  defaultValue: FieldsInfo[T];
  validate: (value: FieldsInfo[T]) => ErrorMessage | null;
  required: boolean;
  label: string;
  uiFieldDescriptor: UIFieldDescriptor;
}

export type FieldsDescriptors = {
  [K in FieldIdentifier]: FieldDescriptor<K>;
};

export const fieldDescriptorsCore: FieldsDescriptors = {
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
    uiFieldDescriptor: { 
      type: 'select', 
      placeholder: 'Select blood type',
      options: [
        { label: 'A+', value: 'A+' },
        { label: 'A-', value: 'A-' },
        { label: 'B+', value: 'B+' },
        { label: 'B-', value: 'B-' },
        { label: 'AB+', value: 'AB+' },
        { label: 'AB-', value: 'AB-' },
        { label: 'O+', value: 'O+' },
        { label: 'O-', value: 'O-' },
      ]
    },
  },
  height: {
    name: 'height',
    getFromUser: (user) => user.height?.toString() || '',
    setOnUserPatch: (user, value) => { user.height = parseInt(value, 10); },
    defaultValue: '',
    required: false,
    validate: () => null,
    label: 'Height (cm)',
    uiFieldDescriptor: { type: 'input', descriptor: { type: 'number', min: 0, max: 300, step: 0.1 } },
  },
  weight: {
    name: 'weight',
    getFromUser: (user) => user.weight?.toString() || '',
    setOnUserPatch: (user, value) => { user.weight = parseInt(value, 10); },
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

export const fieldIdentifiers = Object.keys(fieldDescriptorsCore) as Array<FieldIdentifier>;

export const fieldDescriptors = Object.assign(fieldDescriptorsCore, {
  getFieldsInfoFromUser: (user: User) => {
    return fieldIdentifiers.reduce((acc, key) => {
      acc[key] = fieldDescriptorsCore[key].getFromUser(user);
      return acc;
    }, {} as FieldsInfo);
  },
  getDefaultFieldsInfo: () => {
    return fieldIdentifiers.reduce((acc, key) => {
      acc[key] = fieldDescriptorsCore[key].defaultValue;
      return acc;
    }, {} as FieldsInfo);
  },
  getUserPatchFromFieldsInfo: (fieldsInfo: FieldsInfo) => {
    return fieldIdentifiers.reduce((acc, key) => {
      fieldDescriptorsCore[key].setOnUserPatch(acc, fieldsInfo[key]);
      return acc;
    }, {} as UserPatch);
  }
});
