import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AppLayout from "@/components/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    FileText,
    Search,
    Shield,
    Clock,
    User as UserIcon,
    Code,
    Eye,
} from "lucide-react";
import { PaginatedResponse } from "@/types/shortlink";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface AuditLogItem {
    id: string;
    user_id: string | null;
    action: string;
    entity_type: string | null;
    entity_id: string | null;
    ip_address: string | null;
    user_agent: string | null;
    metadata: Record<string, any> | null;
    created_at: string;
    user?: {
        id: string;
        name: string;
        email: string;
    };
}

interface AuditLogIndexProps {
    logs: PaginatedResponse<AuditLogItem>;
    actions: string[];
    users: { id: string; name: string }[];
    filters: {
        search?: string;
        action?: string;
        user_id?: string;
    };
}

export default function AuditLogIndex({ logs, actions, users, filters }: AuditLogIndexProps) {
    const [search, setSearch] = useState(filters.search || "");
    const [action, setAction] = useState(filters.action || "");
    const [userId, setUserId] = useState(filters.user_id || "");

    const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);

    const applyFilters = (newSearch?: string, newAction?: string, newUserId?: string) => {
        router.get(
            "/admin/audit-logs",
            {
                search: newSearch !== undefined ? newSearch : search,
                action: newAction !== undefined ? newAction : action,
                user_id: newUserId !== undefined ? newUserId : userId,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters(search, action, userId);
    };

    const getActionBadgeClass = (act: string) => {
        if (act.includes("DELETE")) return "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/50 dark:border-rose-800";
        if (act.includes("CREATE")) return "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/50 dark:border-emerald-800";
        if (act.includes("UPDATE")) return "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/50 dark:border-blue-800";
        if (act.includes("FAILED")) return "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/50 dark:border-amber-800";
        return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:border-slate-700";
    };

    return (
        <AppLayout
            title="Log Audit Sistem"
            breadcrumbs={[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Log Audit" },
            ]}
        >
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        Log Audit & Jejak Rekam Sistem
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Catatan audit append-only yang tidak dapat dimodifikasi untuk akuntabilitas operasional
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center gap-3">
                    <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <Input
                            placeholder="Cari aksi, IP, atau pengguna..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9.5 text-xs bg-slate-50 dark:bg-slate-800/50"
                        />
                    </form>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <select
                            value={action}
                            onChange={(e) => {
                                setAction(e.target.value);
                                applyFilters(search, e.target.value, userId);
                            }}
                            className="h-9 px-3 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-primary/20 text-slate-700 dark:text-slate-300"
                        >
                            <option value="">Semua Aksi</option>
                            {actions.map((act) => (
                                <option key={act} value={act}>
                                    {act}
                                </option>
                            ))}
                        </select>

                        <select
                            value={userId}
                            onChange={(e) => {
                                setUserId(e.target.value);
                                applyFilters(search, action, e.target.value);
                            }}
                            className="h-9 px-3 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-primary/20 text-slate-700 dark:text-slate-300"
                        >
                            <option value="">Semua Pengguna</option>
                            {users.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Audit Logs Table */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50/75 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase">
                                <tr>
                                    <th className="py-3.5 px-4">Waktu</th>
                                    <th className="py-3.5 px-4">Aksi</th>
                                    <th className="py-3.5 px-4">Pengguna</th>
                                    <th className="py-3.5 px-4">Alamat IP</th>
                                    <th className="py-3.5 px-4 text-right">Detail</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {logs.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-slate-400 text-sm">
                                            Tidak ada catatan log audit yang ditemukan.
                                        </td>
                                    </tr>
                                ) : (
                                    logs.data.map((log) => (
                                        <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                                                {new Date(log.created_at).toLocaleString("id-ID", {
                                                    dateStyle: "medium",
                                                    timeStyle: "medium",
                                                })}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-block px-2.5 py-0.5 rounded-md font-mono text-[11px] font-semibold border ${getActionBadgeClass(log.action)}`}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                {log.user ? (
                                                    <div>
                                                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                                                            {log.user.name}
                                                        </div>
                                                        <div className="text-[10px] text-slate-400">{log.user.email}</div>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400 italic">Sistem / Tamu</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 font-mono text-slate-500">
                                                {log.ip_address || "-"}
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setSelectedLog(log)}
                                                    className="h-7 text-xs gap-1"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    <span>Lihat</span>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {logs.links && logs.links.length > 3 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                            <span className="text-slate-500">
                                Menampilkan {logs.from || 0} - {logs.to || 0} dari {logs.total} log
                            </span>
                            <div className="flex gap-1">
                                {logs.links.map((link, idx) => (
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

            {/* Metadata Detail Dialog */}
            <Dialog open={Boolean(selectedLog)} onOpenChange={() => setSelectedLog(null)}>
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <span>Detail Log:</span>
                            <span className="font-mono text-primary text-sm">{selectedLog?.action}</span>
                        </DialogTitle>
                        <DialogDescription>
                            Direkam pada {selectedLog ? new Date(selectedLog.created_at).toLocaleString("id-ID") : ""}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedLog && (
                        <div className="space-y-4 py-2 text-xs">
                            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                                <div>
                                    <span className="text-slate-400 block">Pengguna:</span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                                        {selectedLog.user ? `${selectedLog.user.name} (${selectedLog.user.email})` : "Sistem"}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-slate-400 block">Alamat IP:</span>
                                    <span className="font-mono text-slate-800 dark:text-slate-200">
                                        {selectedLog.ip_address || "-"}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-slate-400 block">Tipe Entitas:</span>
                                    <span className="font-mono text-slate-800 dark:text-slate-200">
                                        {selectedLog.entity_type || "-"}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-slate-400 block">ID Entitas:</span>
                                    <span className="font-mono text-slate-800 dark:text-slate-200 truncate block">
                                        {selectedLog.entity_id || "-"}
                                    </span>
                                </div>
                            </div>

                            {selectedLog.user_agent && (
                                <div className="space-y-1">
                                    <span className="text-slate-400 block font-semibold uppercase text-[10px]">
                                        User Agent
                                    </span>
                                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 font-mono text-[11px] break-words text-slate-600 dark:text-slate-300">
                                        {selectedLog.user_agent}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1">
                                <span className="text-slate-400 block font-semibold uppercase text-[10px]">
                                    Metadata JSON
                                </span>
                                <pre className="p-3 rounded-lg bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto max-h-48">
                                    {selectedLog.metadata
                                        ? JSON.stringify(selectedLog.metadata, null, 2)
                                        : "null"}
                                </pre>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
