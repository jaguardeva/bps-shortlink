import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import AppLayout from "@/components/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import {
    BarChart3,
    MousePointerClick,
    Users,
    Calendar,
    Globe,
    Smartphone,
    Monitor,
    ExternalLink,
    TrendingUp,
    Compass,
    ArrowUpRight,
} from "lucide-react";
import { OverviewStats, TimeSeriesData } from "@/types/analytics";
import { Shortlink } from "@/types/shortlink";

interface AnalyticsIndexProps {
    period: string;
    stats: OverviewStats;
    clicksOverTime: TimeSeriesData[];
    devices: { device_type: string; count: number }[];
    browsers: { browser: string; count: number }[];
    operatingSystems: { operating_system: string; count: number }[];
    referrers: { referrer: string; count: number }[];
    topShortlinks: Shortlink[];
    targetUser?: { id: string; name: string; email: string };
}

export default function AnalyticsIndex({
    period,
    stats,
    clicksOverTime,
    devices,
    browsers,
    operatingSystems,
    referrers,
    topShortlinks,
    targetUser,
}: AnalyticsIndexProps) {
    const handlePeriodChange = (newPeriod: string) => {
        router.get(
            window.location.pathname,
            { period: newPeriod },
            { preserveState: true, replace: true }
        );
    };

    // Calculate max clicks for chart scaling
    const maxClick = Math.max(...clicksOverTime.map((d) => d.total), 1);

    const totalDeviceClicks = devices.reduce((acc, curr) => acc + curr.count, 0) || 1;
    const totalBrowserClicks = browsers.reduce((acc, curr) => acc + curr.count, 0) || 1;

    return (
        <AppLayout
            title={targetUser ? `Statistik: ${targetUser.name}` : "Statistik & Analisis"}
            breadcrumbs={[
                { label: "Dashboard", href: "/dashboard" },
                { label: targetUser ? `Statistik (${targetUser.name})` : "Analisis" },
            ]}
        >
            <div className="space-y-6">
                {/* Header & Period Filter */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            {targetUser ? `Analisis Tautan - ${targetUser.name}` : "Ikhtisar Statistik & Analisis"}
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {targetUser
                                ? `Pantau performa dan klik seluruh tautan milik ${targetUser.email}`
                                : "Pantau performa klik, pengunjung, dan sebaran perangkat secara real-time"}
                        </p>
                    </div>

                    <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                        {[
                            { key: "7d", label: "7 Hari" },
                            { key: "30d", label: "30 Hari" },
                            { key: "90d", label: "90 Hari" },
                            { key: "1y", label: "1 Tahun" },
                        ].map((item) => (
                            <button
                                key={item.key}
                                onClick={() => handlePeriodChange(item.key)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                    period === item.key
                                        ? "bg-white dark:bg-slate-900 text-primary shadow-xs font-semibold"
                                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
                        <div className="flex items-center justify-between text-slate-500">
                            <span className="text-xs font-semibold uppercase tracking-wider">Total Klik</span>
                            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
                                <MousePointerClick className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="flex items-baseline justify-between">
                            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                {stats.total_clicks.toLocaleString()}
                            </div>
                            <span className="text-xs text-emerald-600 font-medium flex items-center gap-0.5">
                                <TrendingUp className="w-3 h-3" />
                                Semua
                            </span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
                        <div className="flex items-center justify-between text-slate-500">
                            <span className="text-xs font-semibold uppercase tracking-wider">Pengunjung Unik</span>
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
                                <Users className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="flex items-baseline justify-between">
                            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                {stats.unique_visitors.toLocaleString()}
                            </div>
                            <span className="text-xs text-slate-400">Berdasarkan IP</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
                        <div className="flex items-center justify-between text-slate-500">
                            <span className="text-xs font-semibold uppercase tracking-wider">Klik Hari Ini</span>
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center">
                                <Calendar className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="flex items-baseline justify-between">
                            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                {stats.clicks_today.toLocaleString()}
                            </div>
                            <span className="text-xs text-slate-400">24 jam terakhir</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
                        <div className="flex items-center justify-between text-slate-500">
                            <span className="text-xs font-semibold uppercase tracking-wider">Tautan Aktif</span>
                            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center">
                                <BarChart3 className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="flex items-baseline justify-between">
                            <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                {stats.active_shortlinks} / {stats.total_shortlinks}
                            </div>
                            <span className="text-xs text-slate-400">Total tautan</span>
                        </div>
                    </div>
                </div>

                {/* Clicks Timeline Chart */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                                Tren Aktivitas Klik
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Frekuensi klik harian selama periode terpilih
                            </p>
                        </div>
                    </div>

                    {clicksOverTime.length === 0 ? (
                        <div className="py-16 text-center text-slate-400 dark:text-slate-500 text-sm">
                            Belum ada riwayat klik pada rentang waktu ini.
                        </div>
                    ) : (
                        <div className="pt-6">
                            <div className="h-56 w-full flex items-end gap-2 sm:gap-3 overflow-x-auto pb-4">
                                {clicksOverTime.map((item, idx) => {
                                    const heightPercent = Math.max((item.total / maxClick) * 100, 6);
                                    return (
                                        <div
                                            key={idx}
                                            className="flex-1 min-w-[28px] max-w-[48px] flex flex-col items-center gap-2 group relative"
                                        >
                                            <div className="opacity-0 group-hover:opacity-100 absolute -top-10 transition-opacity bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[11px] py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10 shadow-lg">
                                                {item.date}: {item.total} klik ({item.unique_clicks} unik)
                                            </div>
                                            <div
                                                className="w-full bg-primary/20 dark:bg-primary/30 rounded-t-lg group-hover:bg-primary transition-all relative overflow-hidden flex items-end justify-center"
                                                style={{ height: `${heightPercent}%` }}
                                            >
                                                <div
                                                    className="w-full bg-primary transition-all rounded-t-lg"
                                                    style={{
                                                        height: `${(item.unique_clicks / Math.max(item.total, 1)) * 100}%`,
                                                    }}
                                                />
                                            </div>
                                            <span className="text-[10px] text-slate-400 font-mono transform -rotate-45 origin-top-left mt-2 truncate w-8 block">
                                                {item.date.slice(5)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex items-center justify-end gap-4 text-xs text-slate-500 mt-4 border-t border-slate-100 dark:border-slate-800 pt-3">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-primary/30" />
                                    <span>Total Klik</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                                    <span>Pengunjung Unik</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Device & Browser Breakdowns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Device Breakdown */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-4">
                        <div className="flex items-center gap-2">
                            <Smartphone className="w-4 h-4 text-primary" />
                            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                                Perangkat Pengunjung
                            </h2>
                        </div>
                        {devices.length === 0 ? (
                            <p className="text-xs text-slate-400 py-6 text-center">Belum ada data perangkat.</p>
                        ) : (
                            <div className="space-y-3 pt-2">
                                {devices.map((device, idx) => {
                                    const percent = Math.round((device.count / totalDeviceClicks) * 100);
                                    return (
                                        <div key={idx} className="space-y-1">
                                            <div className="flex items-center justify-between text-xs font-medium">
                                                <span className="text-slate-700 dark:text-slate-300">
                                                    {device.device_type || "Lainnya"}
                                                </span>
                                                <span className="text-slate-500">
                                                    {device.count.toLocaleString()} ({percent}%)
                                                </span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary rounded-full transition-all"
                                                    style={{ width: `${percent}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Browser Breakdown */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-4">
                        <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-primary" />
                            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                                Peramban (Browser)
                            </h2>
                        </div>
                        {browsers.length === 0 ? (
                            <p className="text-xs text-slate-400 py-6 text-center">Belum ada data browser.</p>
                        ) : (
                            <div className="space-y-3 pt-2">
                                {browsers.map((b, idx) => {
                                    const percent = Math.round((b.count / totalBrowserClicks) * 100);
                                    return (
                                        <div key={idx} className="space-y-1">
                                            <div className="flex items-center justify-between text-xs font-medium">
                                                <span className="text-slate-700 dark:text-slate-300">
                                                    {b.browser || "Lainnya"}
                                                </span>
                                                <span className="text-slate-500">
                                                    {b.count.toLocaleString()} ({percent}%)
                                                </span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-sky-500 rounded-full transition-all"
                                                    style={{ width: `${percent}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Shortlinks Table */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                                Tautan Terpopuler
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Shortlink dengan akumulasi klik terbanyak
                            </p>
                        </div>
                        <Button asChild variant="outline" size="sm" className="gap-1.5">
                            <Link href="/shortlinks">
                                <span>Lihat Semua Tautan</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                        </Button>
                    </div>

                    {topShortlinks.length === 0 ? (
                        <div className="py-10 text-center text-slate-400 text-sm">
                            Belum ada tautan yang dibuat.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase">
                                        <th className="pb-3">Tautan & Judul</th>
                                        <th className="pb-3">Tujuan</th>
                                        <th className="pb-3 text-right">Total Klik</th>
                                        <th className="pb-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {topShortlinks.map((link) => (
                                        <tr key={link.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="py-3 pr-4">
                                                <div className="font-semibold text-slate-800 dark:text-slate-200">
                                                    {link.title || link.slug}
                                                </div>
                                                <div className="font-mono text-primary text-[11px]">
                                                    link.kanal3516.site/{link.slug}
                                                </div>
                                            </td>
                                            <td className="py-3 pr-4 max-w-[240px] truncate text-slate-500">
                                                {link.destination_url}
                                            </td>
                                            <td className="py-3 text-right font-bold text-slate-900 dark:text-slate-100 pr-4">
                                                {link.click_count.toLocaleString()}
                                            </td>
                                            <td className="py-3 text-right">
                                                <Button asChild variant="ghost" size="sm" className="h-7 text-xs gap-1">
                                                    <Link href={`/analytics/shortlink/${link.id}`}>
                                                        <span>Detail</span>
                                                        <ArrowUpRight className="w-3 h-3" />
                                                    </Link>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
