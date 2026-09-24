import React from "react";
import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/components/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    Edit,
    Mail,
    Shield,
    Calendar,
    Globe,
    Link2,
    MousePointerClick,
    BarChart3,
    Clock,
    Activity,
    ArrowUpRight,
} from "lucide-react";
import { User } from "@/types/auth";
import { Shortlink } from "@/types/shortlink";

interface UserShowProps {
    targetUser: User;
    stats: {
        total_shortlinks: number;
        active_shortlinks: number;
        total_clicks: number;
    };
    recentShortlinks: Shortlink[];
    recentActivity: {
        id: string;
        action: string;
        created_at: string;
        ip_address?: string;
    }[];
}

export default function UserShow({
    targetUser,
    stats,
    recentShortlinks,
    recentActivity,
}: UserShowProps) {
    return (
        <AppLayout
            title={`Profil Pengguna: ${targetUser.name}`}
            breadcrumbs={[
                { label: "Kelola Pengguna", href: "/admin/users" },
                { label: targetUser.name },
            ]}
            actions={
                <div className="flex items-center gap-2">
                    <Button asChild variant="outline" size="sm" className="gap-1.5 h-8 sm:h-9">
                        <Link href={`/admin/analytics/users/${targetUser.id}`}>
                            <BarChart3 className="w-4 h-4" />
                            <span className="hidden sm:inline">Statistik</span>
                        </Link>
                    </Button>
                    <Button asChild size="sm" className="gap-1.5 h-8 sm:h-9">
                        <Link href={`/admin/users/${targetUser.id}/edit`}>
                            <Edit className="w-4 h-4" />
                            <span className="hidden sm:inline">Edit Profil</span>
                        </Link>
                    </Button>
                </div>
            }
        >
            <div className="space-y-6">
                {/* Back button and profile header */}
                <div className="flex items-center gap-3">
                    <Button asChild variant="ghost" size="icon" className="h-9 w-9">
                        <Link href="/admin/users">
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                {targetUser.name}
                            </h1>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                targetUser.status === "active"
                                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                    : "bg-rose-50 text-rose-600 border border-rose-200"
                            }`}>
                                {targetUser.status === "active" ? "Aktif" : "Nonaktif"}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {targetUser.email}
                        </p>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
                            <span>Total Tautan</span>
                            <Link2 className="w-4 h-4 text-blue-500" />
                        </div>
                        <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            {stats.total_shortlinks}
                        </div>
                        <p className="text-[11px] text-slate-400">{stats.active_shortlinks} tautan berstatus aktif</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
                            <span>Total Akumulasi Klik</span>
                            <MousePointerClick className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            {stats.total_clicks.toLocaleString()}
                        </div>
                        <p className="text-[11px] text-slate-400">Dari seluruh tautan yang dimiliki</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
                        <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
                            <span>Login Terakhir</span>
                            <Clock className="w-4 h-4 text-indigo-500" />
                        </div>
                        <div className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 truncate">
                            {targetUser.last_login_at
                                ? new Date(targetUser.last_login_at).toLocaleString("id-ID", {
                                      dateStyle: "medium",
                                      timeStyle: "short",
                                  })
                                : "Belum pernah"}
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono">
                            {targetUser.last_login_ip ? `IP: ${targetUser.last_login_ip}` : "IP tidak tersedia"}
                        </p>
                    </div>
                </div>

                {/* Details & Roles */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-4">
                    <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                        Informasi Akun & Hak Akses
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                            <div className="flex items-center gap-2 text-slate-400 font-semibold uppercase">
                                <Shield className="w-3.5 h-3.5 text-primary" />
                                <span>Peran (Role)</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                                {targetUser.roles?.map((r) => (
                                    <span
                                        key={r.id}
                                        className="px-2.5 py-1 rounded-md font-mono text-xs font-semibold uppercase bg-primary/10 text-primary border border-primary/20"
                                    >
                                        {r.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                            <div className="flex items-center gap-2 text-slate-400 font-semibold uppercase">
                                <Calendar className="w-3.5 h-3.5 text-primary" />
                                <span>Tanggal Terdaftar</span>
                            </div>
                            <div className="text-slate-800 dark:text-slate-200 font-medium pt-1">
                                {new Date(targetUser.created_at).toLocaleDateString("id-ID", {
                                    dateStyle: "full",
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Shortlinks */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                            Tautan Terbaru Dibuat
                        </h2>
                    </div>

                    {recentShortlinks.length === 0 ? (
                        <p className="text-xs text-slate-400 py-6 text-center">
                            Pengguna ini belum membuat tautan pendek apapun.
                        </p>
                    ) : (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                            {recentShortlinks.map((link) => (
                                <div key={link.id} className="py-3 flex items-center justify-between gap-4">
                                    <div>
                                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                                            {link.title || link.slug}
                                        </div>
                                        <div className="font-mono text-primary text-[11px]">
                                            link.kanal3516.site/{link.slug}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-bold text-slate-900 dark:text-slate-100">
                                            {link.click_count} klik
                                        </span>
                                        <Button asChild variant="ghost" size="sm" className="h-7 text-xs gap-1">
                                            <Link href={`/shortlinks/${link.id}`}>
                                                <span>Detail</span>
                                                <ArrowUpRight className="w-3 h-3" />
                                            </Link>
                                        </Button>
                                    </div>
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
                            Aktivitas Audit Terbaru
                        </h2>
                    </div>

                    {recentActivity.length === 0 ? (
                        <p className="text-xs text-slate-400 py-6 text-center">Belum ada riwayat aktivitas tercatat.</p>
                    ) : (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                            {recentActivity.map((act) => (
                                <div key={act.id} className="py-2.5 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                                            {act.action}
                                        </span>
                                        {act.ip_address && (
                                            <span className="text-[11px] text-slate-400 font-mono">
                                                ({act.ip_address})
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-slate-400 text-[11px]">
                                        {new Date(act.created_at).toLocaleString("id-ID")}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
