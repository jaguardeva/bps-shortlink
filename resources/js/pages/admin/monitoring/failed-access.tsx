import React from "react";
import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/components/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { ShieldAlert, AlertTriangle, Clock, Globe } from "lucide-react";
import { PaginatedResponse } from "@/types/shortlink";

interface MonitoringFailedProps {
    failedAttempts: PaginatedResponse<{
        id: string;
        action: string;
        ip_address: string | null;
        user_agent: string | null;
        metadata: any;
        created_at: string;
        user?: {
            id: string;
            name: string;
            email: string;
        };
    }>;
}

export default function MonitoringFailedAccess({ failedAttempts }: MonitoringFailedProps) {
    return (
        <AppLayout
            title="Percobaan Akses Gagal"
            breadcrumbs={[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Pemantauan" },
                { label: "Akses Gagal" },
            ]}
        >
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        Insiden & Percobaan Akses Gagal
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Log deteksi kesalahan otentikasi login, kegagalan kata sandi tautan, atau anomali akses
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                        <ShieldAlert className="w-4 h-4 text-rose-500" />
                        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                            Daftar Percobaan Gagal Terdeteksi
                        </h2>
                    </div>

                    {failedAttempts.data.length === 0 ? (
                        <div className="py-12 text-center text-slate-400 text-sm">
                            Tidak ada insiden atau kegagalan akses keamanan yang tercatat. Sistem dalam kondisi aman.
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {failedAttempts.data.map((item) => (
                                <div key={item.id} className="py-4 space-y-2 text-xs">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-[11px] font-bold px-2.5 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/50 dark:border-rose-800">
                                                {item.action}
                                            </span>
                                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                {item.user ? `${item.user.name} (${item.user.email})` : "Tamu / Pengunjung Publik"}
                                            </span>
                                        </div>
                                        <div className="text-slate-400 font-mono text-[11px]">
                                            {new Date(item.created_at).toLocaleString("id-ID")}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 text-slate-500">
                                        {item.ip_address && (
                                            <div className="font-mono text-[11px]">
                                                IP: <span className="text-slate-800 dark:text-slate-200">{item.ip_address}</span>
                                            </div>
                                        )}
                                        {item.metadata?.slug && (
                                            <div className="font-mono text-[11px]">
                                                Slug Target: <span className="text-primary">{item.metadata.slug}</span>
                                            </div>
                                        )}
                                        {item.metadata?.email && (
                                            <div className="font-mono text-[11px]">
                                                Email Dicoba: <span className="text-slate-800 dark:text-slate-200">{item.metadata.email}</span>
                                            </div>
                                        )}
                                    </div>

                                    {item.user_agent && (
                                        <div className="font-mono text-[10px] text-slate-400 truncate max-w-2xl">
                                            UA: {item.user_agent}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {failedAttempts.links && failedAttempts.links.length > 3 && (
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                            <span className="text-slate-500">
                                Halaman {failedAttempts.current_page} dari {failedAttempts.last_page}
                            </span>
                            <div className="flex gap-1">
                                {failedAttempts.links.map((link, idx) => (
                                    <Button
                                        key={idx}
                                        asChild={Boolean(link.url)}
                                        disabled={!link.url}
                                        variant={link.active ? "default" : "outline"}
                                        size="sm"
                                        className="h-8 px-3 text-xs"
                                    >
                                        {link.url ? (
                                            <Link
                                                href={link.url}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                        )}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
