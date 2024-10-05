export interface User {
    id: number;
    role: Role;
    firstName: string;
    lastName: string;
    password?: string;
    imageURL: string | null;
    isActive: boolean;
    addressLine1: string | null;
    addressLine2: string | null;
    state: string | null;
    country: string | null;
    city: string | null;
    zipcode: string | null;
    resetToken?: string;
    resetTokenExpires?: string;
    lastLoginTime: string;
    updatedBy?: number;
    contactDetails: ContactDetails;
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
export interface Role {
    id: number;
    roleName: string;
    roleDescription: string;
  }