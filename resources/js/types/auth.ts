export type Role = {
    id: string;
    name: string;
    guard_name?: string;
    created_at?: string;
};

export type User = {
    id: string;
    name: string;
    email: string;
    status: 'active' | 'inactive' | 'suspended';
    roles: Role[];
    shortlinks_count?: number;
    email_verified_at: string | null;
    last_login_at: string | null;
    last_login_ip?: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};
