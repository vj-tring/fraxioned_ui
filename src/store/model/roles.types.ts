export interface Role {
    id: number;
    roleName: string;
    roleDescription?: string | null;
}

export interface RolesState {
    roles: Role[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}