export type User = {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    created_at?: string;
};

export type PaginatedUsers = {
    current_page: number;
    data: User[];
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
};

export type RegisterPayload = {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export type UserPayload = {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password?: string;
    password_confirmation?: string;
};