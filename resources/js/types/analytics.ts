import { Shortlink } from './shortlink';

export type TimeSeriesData = {
    date: string;
    total: number;
    unique_clicks: number;
};

export type BreakdownItem = {
    [key: string]: string | number;
    count: number;
};

export type OverviewStats = {
    total_shortlinks: number;
    active_shortlinks: number;
    total_clicks: number;
    unique_visitors: number;
    clicks_today: number;
    clicks_this_week: number;
    clicks_this_month: number;
};

export type RecentClickItem = {
    id: string;
    ip_address: string;
    browser: string | null;
    operating_system: string | null;
    device_type: string | null;
    referrer: string | null;
    clicked_at: string | null;
};

export type ShortlinkAnalyticsDetail = {
    overview: {
        total_clicks: number;
        unique_visitors: number;
        all_time_clicks: number;
        last_clicked_at: string | null;
    };
    clicks_over_time: TimeSeriesData[];
    devices: { device_type: string; count: number }[];
    browsers: { browser: string; count: number }[];
    operating_systems: { operating_system: string; count: number }[];
    referrers: { referrer: string; count: number }[];
    recent_clicks: RecentClickItem[];
};
