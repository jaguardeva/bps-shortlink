import React from "react";
import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/components/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Activity, Clock, Shield, Globe, User as UserIcon } from "lucide-react";
import { PaginatedResponse } from "@/types/shortlink";

interface MonitoringActivityProps {
    activities: PaginatedResponse<{
        id: string;
        action: string;
        entity_type: string | null;
        entity_id: string | null;
        ip_address: string | null;
        metadata: any;
        created_at: string;
        user?: {
            id: string;
            name: string;
            email: string;
        };
    }>;
}

export default function MonitoringActivity({ activities }: MonitoringActivityProps) {
    return (
        <AppLayout
            title="Pemantauan Aktivitas Sistem"
            breadcrumbs={[{ label: "Aktivitas Sistem" }]}
        >
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        Aktivitas Sistem Real-Time
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Aliran seluruh aktivitas pengguna, perubahan tautan, dan event sistem
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                        <Activity className="w-4 h-4 text-primary animate-pulse" />
                        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                            Log Peristiwa Terkini
                        </h2>
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {activities.data.map((act) => (
                            <div key={act.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
                                <div className="flex items-start sm:items-center gap-3">
                                    <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
                                        {act.action}
                                    </span>
                                    <div>
                                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                                            {act.user ? `${act.user.name} (${act.user.email})` : "Sistem / Otomatis"}
                                        </div>
                                        {act.ip_address && (
                                            <div className="text-[11px] font-mono text-slate-400">
                                                IP: {act.ip_address}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="text-slate-400 text-[11px] whitespace-nowrap self-start sm:self-center font-mono">
                                    {new Date(act.created_at).toLocaleString("id-ID")}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {activities.links && activities.links.length > 3 && (
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                            <span className="text-slate-500">
                                Halaman {activities.current_page} dari {activities.last_page}
                            </span>
                            <div className="flex gap-1">
                                {activities.links.map((link, idx) => (
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
