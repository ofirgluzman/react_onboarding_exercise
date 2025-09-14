export interface User {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  phone: string;
  image: string;
  university: string;
  gender?: string;
  birthDate?: string;
  bloodGroup?: string;
  height?: string;
  weight?: string;
  eyeColor?: string;
  address: {
    city: string;
    state: string;
    stateCode: string;
    country?: string;
  };
  company: {
    department: string;
    name: string;
    title: string;
  };
}
