export type Tag = {
    id: string;
    name: string;
    slug: string;
};

export type ShortlinkUser = {
    id: string;
    name: string;
    email: string;
};

export type QrCode = {
    id: string;
    shortlink_id: string;
    format: 'png' | 'svg';
    size: number;
};

export type Shortlink = {
    id: string;
    user_id: string;
    slug: string;
    title: string | null;
    description: string | null;
    destination_url: string;
    has_password: boolean;
    status: 'active' | 'disabled' | 'expired';
    is_expired?: boolean;
    expires_at: string | null;
    click_count: number;
    last_clicked_at: string | null;
    created_at: string;
    tags: Tag[];
    user?: ShortlinkUser;
    qr_code?: QrCode | null;
};

export type PaginatedResponse<T> = {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
};
