import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import AppLayout from "@/components/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/lib/utils";
import {
    Copy,
    Check,
    ExternalLink,
    QrCode as QrCodeIcon,
    BarChart3,
    Edit,
    Power,
    Trash2,
    Lock,
    Clock,
    Globe,
    User as UserIcon,
    Download,
    Calendar,
    MousePointerClick,
    Shield,
    Tag as TagIcon,
    ArrowLeft,
    RefreshCw,
} from "lucide-react";
import type { Shortlink } from "@/types";

interface RecentClick {
    id: string;
    clicked_at: string;
    browser: string | null;
    operating_system: string | null;
    device_type: string | null;
    ip_address: string | null;
    country: string | null;
}

interface ShowShortlinkProps {
    shortlink: Shortlink;
    recentClicks: RecentClick[];
    appUrl: string;
}

export default function ShowShortlink({
    shortlink,
    recentClicks,
    appUrl,
}: ShowShortlinkProps) {
    const [copied, setCopied] = useState(false);
    const baseUrl = (typeof window !== "undefined" && window.location.origin ? window.location.origin : (appUrl || "")).replace(/\/+$/, "");
    const fullUrl = `${baseUrl}/${shortlink.slug}`;

    const copyUrl = async () => {
        await copyToClipboard(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const toggleStatus = () => {
        router.patch(`/shortlinks/${shortlink.id}/toggle`, {}, { preserveScroll: true });
    };

    const deleteShortlink = () => {
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus shortlink "/${shortlink.slug}"?`
            )
        ) {
            router.delete(`/shortlinks/${shortlink.id}`);
        }
    };

    return (
        <AppLayout
            title={`Detail /${shortlink.slug}`}
            breadcrumbs={[
                { label: "Kelola Tautan", href: "/shortlinks" },
                { label: `/${shortlink.slug}` },
            ]}
            actions={
                <div className="flex items-center gap-2">
                    <Button asChild variant="outline" size="sm" className="h-8 sm:h-9">
                        <Link href={`/analytics/shortlink/${shortlink.id}`}>
                            <BarChart3 className="size-4 sm:mr-1.5" />
                            <span className="hidden sm:inline">Analitik Lengkap</span>
                        </Link>
                    </Button>
                    <Button asChild size="sm" className="h-8 sm:h-9">
                        <Link href={`/shortlinks/${shortlink.id}/edit`}>
                            <Edit className="size-4 sm:mr-1.5" />
                            <span className="hidden sm:inline">Edit Tautan</span>
                        </Link>
                    </Button>
                </div>
            }
        >
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Top Banner Card */}
                <div className="bg-card rounded-2xl border border-border/60 shadow-sm p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
                        <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-2xl font-bold tracking-tight text-foreground font-mono">
                                    /{shortlink.slug}
                                </span>

                                <button
                                    type="button"
                                    onClick={copyUrl}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted text-xs font-medium hover:bg-muted/80 text-foreground transition-colors"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="size-3.5 text-emerald-500" />
                                            <span>Tersalin!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="size-3.5" />
                                            <span>Salin URL</span>
                                        </>
                                    )}
                                </button>

                                <a
                                    href={fullUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted text-xs font-medium hover:bg-muted/80 text-foreground transition-colors"
                                >
                                    <ExternalLink className="size-3.5" />
                                    <span>Buka Tautan</span>
                                </a>
                            </div>

                            {shortlink.title && (
                                <h2 className="text-base font-semibold text-foreground">
                                    {shortlink.title}
                                </h2>
                            )}

                            {shortlink.description && (
                                <p className="text-sm text-muted-foreground max-w-2xl">
                                    {shortlink.description}
                                </p>
                            )}

                            {shortlink.tags && shortlink.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {shortlink.tags.map((tag) => (
                                        <span
                                            key={tag.id}
                                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-xs text-muted-foreground font-medium"
                                        >
                                            <TagIcon className="size-3" />
                                            {tag.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Status Badges & Quick Stats */}
                        <div className="flex flex-wrap md:flex-col items-start md:items-end justify-between md:justify-start gap-2.5 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-border/50">
                            <div className="flex items-center gap-2">
                                {shortlink.is_expired ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                        <Clock className="size-3.5" />
                                        Kedaluwarsa
                                    </span>
                                ) : shortlink.status === "active" ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                        <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                                        Aktif
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20">
                                        <Power className="size-3.5" />
                                        Dinonaktifkan
                                    </span>
                                )}

                                {shortlink.has_password && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                        <Lock className="size-3.5" />
                                        Kata Sandi
                                    </span>
                                )}
                            </div>

                            <div className="text-left md:text-right">
                                <span className="text-2xl font-black text-foreground tracking-tight">
                                    {shortlink.click_count.toLocaleString("id-ID")}
                                </span>
                                <span className="text-xs text-muted-foreground block">
                                    Total Kunjungan
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main 2-Column Info & QR Code */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Metadata details */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-card rounded-2xl border border-border/60 shadow-sm p-6 space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                Informasi Tautan
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div className="space-y-1">
                                    <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                        <Globe className="size-3.5" />
                                        URL Tujuan Asli
                                    </span>
                                    <a
                                        href={shortlink.destination_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-medium text-primary hover:underline break-all block"
                                    >
                                        {shortlink.destination_url}
                                    </a>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                        <UserIcon className="size-3.5" />
                                        Pemilik Tautan
                                    </span>
                                    <p className="text-sm font-medium text-foreground">
                                        {shortlink.user?.name || "-"} ({shortlink.user?.email})
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                        <Calendar className="size-3.5" />
                                        Waktu Dibuat
                                    </span>
                                    <p className="text-sm font-medium text-foreground">
                                        {new Date(shortlink.created_at).toLocaleString("id-ID", {
                                            dateStyle: "medium",
                                            timeStyle: "short",
                                        })}
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                        <Clock className="size-3.5" />
                                        Waktu Kedaluwarsa
                                    </span>
                                    <p className="text-sm font-medium text-foreground">
                                        {shortlink.expires_at
                                            ? new Date(shortlink.expires_at).toLocaleString("id-ID", {
                                                  dateStyle: "medium",
                                                  timeStyle: "short",
                                              })
                                            : "Tidak ada (Berlaku selamanya)"}
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                                        <MousePointerClick className="size-3.5" />
                                        Terakhir Diklik
                                    </span>
                                    <p className="text-sm font-medium text-foreground">
                                        {shortlink.last_clicked_at
                                            ? new Date(shortlink.last_clicked_at).toLocaleString("id-ID", {
                                                  dateStyle: "medium",
                                                  timeStyle: "short",
                                              })
                                            : "Belum pernah diklik"}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-border/60 flex flex-wrap items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={toggleStatus}
                                    className="gap-1.5"
                                >
                                    <Power className="size-3.5" />
                                    {shortlink.status === "active"
                                        ? "Nonaktifkan Tautan"
                                        : "Aktifkan Tautan"}
                                </Button>

                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={deleteShortlink}
                                    className="gap-1.5"
                                >
                                    <Trash2 className="size-3.5" />
                                    Hapus Tautan
                                </Button>
                            </div>
                        </div>

                        {/* Recent Clicks preview */}
                        <div className="bg-card rounded-2xl border border-border/60 shadow-sm p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                    Riwayat 10 Klik Terakhir
                                </h3>
                                <Link
                                    href={`/analytics/shortlink/${shortlink.id}`}
                                    className="text-xs text-primary hover:underline font-medium"
                                >
                                    Lihat Semua Analitik &rarr;
                                </Link>
                            </div>

                            {recentClicks.length === 0 ? (
                                <p className="text-xs text-muted-foreground py-4 text-center">
                                    Belum ada data kunjungan yang tercatat untuk shortlink ini.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {/* Mobile Cards View */}
                                    <div className="sm:hidden space-y-2">
                                        {recentClicks.map((click) => (
                                            <div
                                                key={click.id}
                                                className="p-3 rounded-xl bg-muted/40 border border-border/60 text-xs space-y-1.5"
                                            >
                                                <div className="flex items-center justify-between text-muted-foreground font-mono text-[11px]">
                                                    <span>
                                                        {new Date(click.clicked_at).toLocaleString("id-ID", {
                                                            dateStyle: "short",
                                                            timeStyle: "short",
                                                        })}
                                                    </span>
                                                    <span className="font-semibold">{click.ip_address || "-"}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-foreground font-medium flex-wrap">
                                                    <span>{click.device_type || "Unknown"}</span>
                                                    <span className="text-muted-foreground">•</span>
                                                    <span>{click.browser || "Unknown"}</span>
                                                    <span className="text-muted-foreground">•</span>
                                                    <span className="text-muted-foreground">{click.operating_system || "Unknown"}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Desktop Table View */}
                                    <div className="hidden sm:block overflow-x-auto">
                                        <table className="w-full text-left text-xs">
                                            <thead className="bg-muted/40 text-muted-foreground font-semibold">
                                                <tr>
                                                    <th className="py-2 px-3 rounded-l">Waktu</th>
                                                    <th className="py-2 px-3">Perangkat</th>
                                                    <th className="py-2 px-3">Browser</th>
                                                    <th className="py-2 px-3">OS</th>
                                                    <th className="py-2 px-3 rounded-r">IP</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border/60">
                                                {recentClicks.map((click) => (
                                                    <tr key={click.id}>
                                                        <td className="py-2 px-3 font-mono">
                                                            {new Date(click.clicked_at).toLocaleString("id-ID", {
                                                                dateStyle: "short",
                                                                timeStyle: "short",
                                                            })}
                                                        </td>
                                                        <td className="py-2 px-3">{click.device_type || "-"}</td>
                                                        <td className="py-2 px-3">{click.browser || "-"}</td>
                                                        <td className="py-2 px-3">{click.operating_system || "-"}</td>
                                                        <td className="py-2 px-3 font-mono text-muted-foreground">
                                                            {click.ip_address || "-"}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: QR Code Card */}
                    <div className="space-y-6">
                        <div className="bg-card rounded-2xl border border-border/60 shadow-sm p-6 flex flex-col items-center text-center space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                QR Code Tautan
                            </h3>

                            <div className="size-48 rounded-xl bg-white p-3 border border-border/80 shadow-inner flex items-center justify-center">
                                <img
                                    src={`/shortlinks/${shortlink.id}/qr`}
                                    alt={`QR Code untuk /${shortlink.slug}`}
                                    className="size-full object-contain"
                                    onError={(e) => {
                                        // Fallback SVG QR or placeholder
                                        (e.target as HTMLElement).style.display = "none";
                                    }}
                                />
                            </div>

                            <p className="text-xs text-muted-foreground max-w-xs">
                                Pindai QR Code untuk langsung mengakses /{shortlink.slug}
                            </p>

                            <div className="flex flex-col w-full gap-2 pt-2">
                                <Button asChild variant="outline" size="sm" className="w-full gap-2">
                                    <a
                                        href={`/shortlinks/${shortlink.id}/qr/download/png`}
                                        download={`qr-${shortlink.slug}.png`}
                                    >
                                        <Download className="size-4" />
                                        Unduh Format PNG
                                    </a>
                                </Button>
                                <Button asChild variant="outline" size="sm" className="w-full gap-2">
                                    <a
                                        href={`/shortlinks/${shortlink.id}/qr/download/svg`}
                                        download={`qr-${shortlink.slug}.svg`}
                                    >
                                        <Download className="size-4" />
                                        Unduh Format SVG
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
