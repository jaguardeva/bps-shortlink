import React from "react";
import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/components/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import {
    Link2,
    PlusCircle,
    MousePointerClick,
    Users,
    TrendingUp,
    Clock,
    AlertTriangle,
    ArrowUpRight,
    Activity,
    Shield,
    Calendar,
    Globe,
    ExternalLink,
} from "lucide-react";
import { Shortlink } from "@/types/shortlink";
import { TimeSeriesData } from "@/types/analytics";

interface DashboardProps {
    isAdmin: boolean;
    stats: {
        total_users?: number;
        active_users?: number;
        total_shortlinks: number;
        active_shortlinks: number;
        expired_shortlinks: number;
        total_clicks: number;
        clicks_today: number;
        clicks_this_month?: number;
    };
    clicksOverTime: TimeSeriesData[];
    topShortlinks: Shortlink[];
    recentClicks?: {
        id: string;
        browser: string | null;
        device_type: string | null;
        clicked_at: string;
        shortlink?: {
            slug: string;
            title: string | null;
        };
    }[];
    recentShortlinks: Shortlink[];
    expiringSoon?: Shortlink[];
    recentActivity?: {
        id: string;
        action: string;
        created_at: string;
        user?: {
            name: string;
        };
    }[];
}

export default function Dashboard({
    isAdmin,
    stats,
    clicksOverTime,
    topShortlinks,
    recentClicks = [],
    recentShortlinks = [],
    expiringSoon = [],
    recentActivity = [],
}: DashboardProps) {
    const maxClicks = Math.max(...clicksOverTime.map((d) => d.total), 1);

    return (
        <AppLayout
            title="Dashboard"
            breadcrumbs={[{ label: "Dashboard" }]}
            actions={
                <div className="flex items-center gap-2">
                    <Button asChild size="sm" className="gap-2 shadow-xs">
                        <Link href="/shortlinks/create">
                            <PlusCircle className="w-4 h-4" />
                            <span>Buat Tautan Baru</span>
                        </Link>
                    </Button>
                </div>
            }
        >
            <div className="space-y-6">
                {/* Welcome Banner */}
                <div className="rounded-2xl p-6 bg-linear-to-r from-sky-600 via-blue-600 to-indigo-700 text-white shadow-md relative overflow-hidden">
                    <div className="absolute right-0 top-0 -mt-6 -mr-6 w-56 h-56 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-md text-white mb-2">
                                <Link2 className="w-3.5 h-3.5" />
                                <span>Platform Tautan Pendek Resmi BPS Kabupaten Mojokerto</span>
                            </span>
                            <h1 className="text-2xl font-extrabold tracking-tight">
                                Selamat Datang di BPS-Link
                            </h1>
                            <p className="text-sky-100 text-xs sm:text-sm mt-1 max-w-xl">
                                Kelola tautan pendek berdomain resmi <span className="font-mono font-semibold">link.kanal3516.site</span> untuk diseminasi data, survei, dan layanan statistik.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button asChild variant="secondary" size="sm" className="gap-2 text-slate-800">
                                <Link href="/shortlinks">
                                    <span>Lihat Semua Tautan</span>
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
                            <span>Total Tautan</span>
                            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
                                <Link2 className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            {stats.total_shortlinks}
                        </div>
                        <p className="text-[11px] text-slate-400">
                            <span className="text-emerald-600 font-semibold">{stats.active_shortlinks} aktif</span>
                            {stats.expired_shortlinks > 0 && ` • ${stats.expired_shortlinks} kedaluwarsa`}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
                            <span>Total Klik</span>
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
                                <MousePointerClick className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            {stats.total_clicks.toLocaleString()}
                        </div>
                        <p className="text-[11px] text-slate-400">Akumulasi seluruh kunjungan</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
                            <span>Klik Hari Ini</span>
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center">
                                <Calendar className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            {stats.clicks_today.toLocaleString()}
                        </div>
                        <p className="text-[11px] text-slate-400">Dalam 24 jam terakhir</p>
                    </div>

                    {isAdmin ? (
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
                            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
                                <span>Pengguna Terdaftar</span>
                                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center">
                                    <Users className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                {stats.total_users || 0}
                            </div>
                            <p className="text-[11px] text-emerald-600 font-semibold">
                                {stats.active_users || 0} pengguna aktif
                            </p>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
                            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
                                <span>Tautan Aktif</span>
                                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center">
                                    <Globe className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                {stats.active_shortlinks}
                            </div>
                            <p className="text-[11px] text-slate-400">Siap dibagikan ke publik</p>
                        </div>
                    )}
                </div>

                {/* Timeline Chart Row */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                                Tren Klik (30 Hari Terakhir)
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Volume akses tautan harian secara visual
                            </p>
                        </div>
                        <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs">
                            <Link href="/analytics">
                                <span>Buka Analisis Lengkap</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                        </Button>
                    </div>

                    {clicksOverTime.length === 0 ? (
                        <div className="py-14 text-center text-slate-400 text-sm">
                            Belum ada riwayat klik tercatat dalam 30 hari terakhir.
                        </div>
                    ) : (
                        <div className="pt-4">
                            <div className="h-44 w-full flex items-end gap-2 overflow-x-auto pb-4">
                                {clicksOverTime.map((item, idx) => {
                                    const heightPercent = Math.max((item.total / maxClicks) * 100, 6);
                                    return (
                                        <div
                                            key={idx}
                                            className="flex-1 min-w-[24px] max-w-[42px] flex flex-col items-center gap-2 group relative"
                                        >
                                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 transition-opacity bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[10px] py-0.5 px-1.5 rounded pointer-events-none whitespace-nowrap z-10 shadow-md">
                                                {item.date}: {item.total} klik
                                            </div>
                                            <div
                                                className="w-full bg-primary/25 rounded-t-lg group-hover:bg-primary transition-all relative overflow-hidden flex items-end justify-center"
                                                style={{ height: `${heightPercent}%` }}
                                            >
                                                <div
                                                    className="w-full bg-primary transition-all rounded-t-lg"
                                                    style={{
                                                        height: `${(item.unique_clicks / Math.max(item.total, 1)) * 100}%`,
                                                    }}
                                                />
                                            </div>
                                            <span className="text-[9px] text-slate-400 font-mono transform -rotate-45 origin-top-left truncate w-6 block">
                                                {item.date.slice(5)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Grid: Top Links & Recent Links */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Shortlinks */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                                Tautan Paling Banyak Diklik
                            </h2>
                            <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
                                <Link href="/shortlinks">Semua Tautan</Link>
                            </Button>
                        </div>

                        {topShortlinks.length === 0 ? (
                            <p className="text-xs text-slate-400 py-6 text-center">Belum ada data tautan.</p>
                        ) : (
                            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                                {topShortlinks.map((link) => (
                                    <div key={link.id} className="py-3 flex items-center justify-between gap-4">
                                        <div className="min-w-0">
                                            <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                                                {link.title || link.slug}
                                            </div>
                                            <div className="font-mono text-primary text-[11px] truncate">
                                                link.kanal3516.site/{link.slug}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className="font-bold text-slate-900 dark:text-slate-100">
                                                {link.click_count.toLocaleString()} klik
                                            </span>
                                            <Button asChild variant="ghost" size="sm" className="h-7 w-7 p-0">
                                                <Link href={`/analytics/shortlink/${link.id}`}>
                                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recently Created Shortlinks */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                                Tautan Terbaru
                            </h2>
                            <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
                                <Link href="/shortlinks">Lihat Semua</Link>
                            </Button>
                        </div>

                        {recentShortlinks.length === 0 ? (
                            <p className="text-xs text-slate-400 py-6 text-center">Belum ada tautan yang dibuat.</p>
                        ) : (
                            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                                {recentShortlinks.map((link) => (
                                    <div key={link.id} className="py-3 flex items-center justify-between gap-4">
                                        <div className="min-w-0">
                                            <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                                                {link.title || link.slug}
                                            </div>
                                            <div className="text-slate-400 text-[11px] truncate">
                                                {link.destination_url}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                                link.status === "active"
                                                    ? "bg-emerald-50 text-emerald-600"
                                                    : "bg-slate-100 text-slate-600"
                                            }`}>
                                                {link.status === "active" ? "Aktif" : "Nonaktif"}
                                            </span>
                                            <Button asChild variant="ghost" size="sm" className="h-7 w-7 p-0">
                                                <Link href={`/shortlinks/${link.id}`}>
                                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Admin Additional Row: Expiring Links & Recent Activities */}
                {isAdmin && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Expiring Soon */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-4">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-amber-500" />
                                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                                    Segera Kedaluwarsa (&lt; 7 Hari)
                                </h2>
                            </div>

                            {expiringSoon.length === 0 ? (
                                <p className="text-xs text-slate-400 py-6 text-center">
                                    Tidak ada tautan yang akan kedaluwarsa dalam waktu dekat.
                                </p>
                            ) : (
                                <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                                    {expiringSoon.map((link) => (
                                        <div key={link.id} className="py-3 flex items-center justify-between gap-4">
                                            <div>
                                                <div className="font-semibold text-slate-900 dark:text-slate-100">
                                                    {link.title || link.slug}
                                                </div>
                                                <div className="text-amber-600 dark:text-amber-400 text-[11px]">
                                                    Kedaluwarsa: {link.expires_at ? new Date(link.expires_at).toLocaleDateString("id-ID") : "-"}
                                                </div>
                                            </div>
                                            <Button asChild variant="outline" size="sm" className="h-7 text-xs">
                                                <Link href={`/shortlinks/${link.id}/edit`}>Perpanjang</Link>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-4">
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-primary" />
                                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                                    Aktivitas Sistem Terkini
                                </h2>
                            </div>

                            {recentActivity.length === 0 ? (
                                <p className="text-xs text-slate-400 py-6 text-center">Belum ada aktivitas tercatat.</p>
                            ) : (
                                <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                                    {recentActivity.map((act) => (
                                        <div key={act.id} className="py-2.5 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                                    {act.action}
                                                </span>
                                                <span className="text-slate-600 dark:text-slate-400">
                                                    {act.user?.name || "Sistem / Tamu"}
                                                </span>
                                            </div>
                                            <span className="text-slate-400 text-[11px]">
                                                {new Date(act.created_at).toLocaleTimeString("id-ID", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
