import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AppLayout from "@/components/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    Copy,
    Check,
    ExternalLink,
    MousePointerClick,
    Users,
    Clock,
    Smartphone,
    Globe,
    Compass,
    Link2,
    Calendar,
    QrCode as QrIcon,
} from "lucide-react";
import { Shortlink } from "@/types/shortlink";
import { ShortlinkAnalyticsDetail } from "@/types/analytics";

interface ShortlinkAnalyticsProps {
    shortlink: Shortlink;
    period: string;
    analytics: ShortlinkAnalyticsDetail;
}

export default function ShortlinkAnalytics({
    shortlink,
    period,
    analytics,
}: ShortlinkAnalyticsProps) {
    const [copied, setCopied] = useState(false);

    const fullUrl = `https://link.kanal3516.site/${shortlink.slug}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handlePeriodChange = (newPeriod: string) => {
        router.get(
            window.location.pathname,
            { period: newPeriod },
            { preserveState: true, replace: true }
        );
    };

    const maxClicks = Math.max(...analytics.clicks_over_time.map((d) => d.total), 1);
    const totalDeviceClicks = analytics.devices.reduce((acc, c) => acc + c.count, 0) || 1;
    const totalBrowserClicks = analytics.browsers.reduce((acc, c) => acc + c.count, 0) || 1;

    return (
        <AppLayout
            title={`Statistik: ${shortlink.slug}`}
            breadcrumbs={[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Tautan", href: "/shortlinks" },
                { label: shortlink.slug, href: `/shortlinks/${shortlink.id}` },
                { label: "Analisis" },
            ]}
        >
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Button asChild variant="ghost" size="icon" className="h-9 w-9">
                            <Link href={`/shortlinks/${shortlink.id}`}>
                                <ArrowLeft className="w-4 h-4" />
                            </Link>
                        </Button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                    {shortlink.title || shortlink.slug}
                                </h1>
                                <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-full ${
                                    shortlink.status === "active"
                                        ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border border-emerald-200 dark:border-emerald-800"
                                        : "bg-rose-50 dark:bg-rose-950/50 text-rose-600 border border-rose-200 dark:border-rose-800"
                                }`}>
                                    {shortlink.status === "active" ? "Aktif" : "Nonaktif"}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <a
                                    href={fullUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs font-mono text-primary hover:underline flex items-center gap-1"
                                >
                                    <span>{fullUrl}</span>
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                                <button
                                    onClick={handleCopy}
                                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                    title="Salin tautan"
                                >
                                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Period Selector */}
                    <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-center">
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
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
                            <span>Klik Periode Ini</span>
                            <MousePointerClick className="w-4 h-4 text-blue-500" />
                        </div>
                        <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            {analytics.overview.total_clicks.toLocaleString()}
                        </div>
                        <p className="text-[11px] text-slate-400">Total interaksi dalam rentang dipilih</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
                            <span>Pengunjung Unik</span>
                            <Users className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            {analytics.overview.unique_visitors.toLocaleString()}
                        </div>
                        <p className="text-[11px] text-slate-400">IP unik yang mengakses tautan</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
                            <span>Total Seluruh Waktu</span>
                            <Globe className="w-4 h-4 text-indigo-500" />
                        </div>
                        <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            {analytics.overview.all_time_clicks.toLocaleString()}
                        </div>
                        <p className="text-[11px] text-slate-400">Akumulasi sejak tautan dibuat</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
                            <span>Klik Terakhir</span>
                            <Clock className="w-4 h-4 text-amber-500" />
                        </div>
                        <div className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100 truncate">
                            {analytics.overview.last_clicked_at
                                ? new Date(analytics.overview.last_clicked_at).toLocaleString("id-ID", {
                                      dateStyle: "medium",
                                      timeStyle: "short",
                                  })
                                : "Belum pernah"}
                        </div>
                        <p className="text-[11px] text-slate-400">Waktu akses terbaru</p>
                    </div>
                </div>

                {/* Timeline Chart */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-4">
                    <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                        Grafik Kunjungan Harian
                    </h2>

                    {analytics.clicks_over_time.length === 0 ? (
                        <div className="py-14 text-center text-slate-400 text-sm">
                            Belum ada rekaman klik pada periode ini.
                        </div>
                    ) : (
                        <div className="pt-4">
                            <div className="h-52 w-full flex items-end gap-2 overflow-x-auto pb-4">
                                {analytics.clicks_over_time.map((d, i) => {
                                    const heightPct = Math.max((d.total / maxClicks) * 100, 6);
                                    return (
                                        <div
                                            key={i}
                                            className="flex-1 min-w-[28px] max-w-[44px] flex flex-col items-center gap-2 group relative"
                                        >
                                            <div className="opacity-0 group-hover:opacity-100 absolute -top-9 transition-opacity bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[10px] py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10 shadow-md">
                                                {d.date}: {d.total} klik ({d.unique_clicks} unik)
                                            </div>
                                            <div
                                                className="w-full bg-primary/25 rounded-t-lg group-hover:bg-primary transition-all relative overflow-hidden flex items-end justify-center"
                                                style={{ height: `${heightPct}%` }}
                                            >
                                                <div
                                                    className="w-full bg-primary transition-all rounded-t-lg"
                                                    style={{
                                                        height: `${(d.unique_clicks / Math.max(d.total, 1)) * 100}%`,
                                                    }}
                                                />
                                            </div>
                                            <span className="text-[10px] text-slate-400 font-mono transform -rotate-45 origin-top-left mt-2 truncate w-7 block">
                                                {d.date.slice(5)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Device & Browser Breakdowns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-3">
                        <div className="flex items-center gap-2">
                            <Smartphone className="w-4 h-4 text-primary" />
                            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                                Perangkat
                            </h2>
                        </div>
                        {analytics.devices.length === 0 ? (
                            <p className="text-xs text-slate-400 py-6 text-center">Belum ada data.</p>
                        ) : (
                            <div className="space-y-3 pt-2">
                                {analytics.devices.map((item, idx) => {
                                    const pct = Math.round((item.count / totalDeviceClicks) * 100);
                                    return (
                                        <div key={idx} className="space-y-1">
                                            <div className="flex justify-between text-xs font-medium">
                                                <span>{item.device_type || "Lainnya"}</span>
                                                <span className="text-slate-500">
                                                    {item.count} ({pct}%)
                                                </span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-3">
                        <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-primary" />
                            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                                Peramban (Browser)
                            </h2>
                        </div>
                        {analytics.browsers.length === 0 ? (
                            <p className="text-xs text-slate-400 py-6 text-center">Belum ada data.</p>
                        ) : (
                            <div className="space-y-3 pt-2">
                                {analytics.browsers.map((item, idx) => {
                                    const pct = Math.round((item.count / totalBrowserClicks) * 100);
                                    return (
                                        <div key={idx} className="space-y-1">
                                            <div className="flex justify-between text-xs font-medium">
                                                <span>{item.browser || "Lainnya"}</span>
                                                <span className="text-slate-500">
                                                    {item.count} ({pct}%)
                                                </span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-sky-500 rounded-full" style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Click Events Log */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-4">
                    <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                        20 Riwayat Klik Terakhir
                    </h2>
                    {analytics.recent_clicks.length === 0 ? (
                        <p className="text-xs text-slate-400 py-6 text-center">Belum ada data rekaman klik.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase">
                                        <th className="pb-3">Waktu</th>
                                        <th className="pb-3">IP (Disamarkan)</th>
                                        <th className="pb-3">Perangkat</th>
                                        <th className="pb-3">Browser</th>
                                        <th className="pb-3">Sistem Operasi</th>
                                        <th className="pb-3">Referrer</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                                    {analytics.recent_clicks.map((c) => (
                                        <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                                            <td className="py-2.5 text-slate-600 dark:text-slate-300 font-sans pr-3">
                                                {c.clicked_at ? new Date(c.clicked_at).toLocaleString("id-ID") : "-"}
                                            </td>
                                            <td className="py-2.5 text-slate-500 pr-3">{c.ip_address}</td>
                                            <td className="py-2.5 text-slate-600 dark:text-slate-300 font-sans pr-3">{c.device_type || "-"}</td>
                                            <td className="py-2.5 text-slate-600 dark:text-slate-300 font-sans pr-3">{c.browser || "-"}</td>
                                            <td className="py-2.5 text-slate-600 dark:text-slate-300 font-sans pr-3">{c.operating_system || "-"}</td>
                                            <td className="py-2.5 text-slate-400 font-sans truncate max-w-[150px]">{c.referrer || "-"}</td>
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
