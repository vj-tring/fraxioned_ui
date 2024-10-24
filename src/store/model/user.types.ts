import { Role } from "./roles.types";

export interface User {
  id?: number;
  role: Role;
  firstName: string;
  lastName: string;
  profileImage?: string | null;
  isActive: boolean;
  addressLine1: string | null;
  addressLine2: string | null;
  state: string | null;
  country: string | null;
  city: string | null;
  zipcode: string | null;
  lastLoginTime: string;
  updatedBy: number;
  contactDetails: ContactDetails;
  password?: string;
  resetToken?: string;
  resetTokenExpires?: string;
}

export interface ContactDetails {
  id: number;
  primaryEmail: string;
  secondaryEmail: string | null;
  optionalEmailOne: string | null;
  optionalEmailTwo: string | null;
  primaryPhone: string;
  secondaryPhone: string | null;
  optionalPhoneOne: string | null;
  optionalPhoneTwo: string | null;
}

export interface UserState {
  user: User;
  loading: boolean;
  error: string | null;
}
export interface UpdateUserData {
  userId: number;
  userData: Partial<User>;
}