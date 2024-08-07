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
