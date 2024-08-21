export interface Role {
  id: number;
  roleName: string;
}
export interface User {
  roleId: number;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  isAdmin: boolean;
  country: string;
  zipcode: string;
  password: string;
  imageURL: string | null;
  isActive: number;
  addressLine1: string | null;
  addressLine2: string | null;
  resetToken: string;
  resetTokenExpires: string | null;
  lastLoginTime: string;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
  role: Role;
}

export interface Session {
    token: string;
    expiresAt: string;
}

export interface AuthState {
    user: User | null;
    session: Session | null;
    loading: boolean;
    error: string | null;
    isAdmin: boolean;
  }

export interface ForgotPasswordState {
    loading: boolean
    successMessage: string | null
    errorMessage: string | null
  }

export interface RegisterState {
    token: string | null
    userId: string | null
    email: string | null
    registering: boolean
    error: string | null
    resettingPassword: boolean
    resetPasswordSuccess: boolean
    resetPasswordError: string | null
  }
  export interface AddPropertyState {
    loading: boolean
    successMessage: string | null
    errorMessage: string | null
    property: Property | null
  }
  
  export interface Property {
    createdBy: { id: number }
    propertyName: string
    ownerRezPropId: number
    address: string
    city: string
    state: string
    country: string
    zipcode: number
    houseDescription: string
    isExclusive: boolean
    propertyShare: number
    latitude: number
    longitude: number
    isActive: boolean
    displayOrder: number
  }





  