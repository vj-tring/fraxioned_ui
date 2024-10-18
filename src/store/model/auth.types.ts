import { User } from "./user.types";

export interface Session {
  token: string;
  expiresAt: string;
  userId: number;
}
export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
}
