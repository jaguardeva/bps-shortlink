import React, { useState } from "react";
import { Link, router } from "@inertiajs/react";
import AppLayout from "@/components/layouts/AppLayout";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Plus,
    Search,
    Copy,
    Check,
    ExternalLink,
    Lock,
    QrCode,
    BarChart3,
    Edit,
    Trash2,
    Power,
    Link2,
    Clock,
    User,
    Tag as TagIcon,
} from "lucide-react";
import type { PaginatedResponse, Shortlink, Tag } from "@/types";

interface ShortlinksIndexProps {
    shortlinks: PaginatedResponse<Shortlink>;
    tags: Tag[];
    filters: {
        search?: string;
        status?: string;
        tag?: string;
        user_id?: string;
    };
    isAdmin: boolean;
}

export default function ShortlinksIndex({
    shortlinks,
    tags,
    filters,
    isAdmin,
}: ShortlinksIndexProps) {
    const [search, setSearch] = useState(filters.search || "");
    const [statusFilter, setStatusFilter] = useState(filters.status || "");
    const [tagFilter, setTagFilter] = useState(filters.tag || "");
    const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            "/shortlinks",
            {
                search: search || undefined,
                status: statusFilter || undefined,
                tag: tagFilter || undefined,
            },
            { preserveState: true }
        );
    };

    const handleFilterChange = (newStatus: string, newTag: string) => {
        setStatusFilter(newStatus);
        setTagFilter(newTag);
        router.get(
            "/shortlinks",
            {
                search: search || undefined,
                status: newStatus || undefined,
                tag: newTag || undefined,
            },
            { preserveState: true }
        );
    };

    const copyToClipboard = (slug: string) => {
        const fullUrl = `${window.location.origin}/${slug}`;
        navigator.clipboard.writeText(fullUrl);
        setCopiedSlug(slug);
        setTimeout(() => setCopiedSlug(null), 2000);
    };

    const toggleStatus = (id: string) => {
        router.patch(`/shortlinks/${id}/toggle`, {}, { preserveScroll: true });
    };

    const deleteShortlink = (id: string, slug: string) => {
        if (confirm(`Apakah Anda yakin ingin menghapus shortlink "${slug}"?`)) {
            router.delete(`/shortlinks/${id}`, { preserveScroll: true });
        }
    };

    return (
        <AppLayout
            title="Kelola Shortlink"
            breadcrumbs={[{ label: "Shortlinks" }]}
            actions={
                <Link
                    href="/shortlinks/create"
                    className={buttonVariants({ className: "gap-2" })}
                >
                    <Plus className="size-4" />
                    <span>Buat Shortlink</span>
                </Link>
            }
        >
            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Search & Filter Header */}
                <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-card p-4 rounded-xl border border-border/50 shadow-sm">
                    <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari slug, judul, atau URL tujuan..."
                                className="pl-9 h-9"
                            />
                        </div>
                        <Button type="submit" variant="secondary" size="sm">
                            Cari
                        </Button>
                    </form>

                    <div className="flex flex-wrap items-center gap-2">
                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                handleFilterChange(e.target.value, tagFilter)
                            }
                            className="h-9 rounded-md border border-input bg-input/20 px-3 text-xs font-medium text-foreground outline-none focus:ring-2 focus:ring-ring"
                        >
                            <option value="">Semua Status</option>
                            <option value="active">Aktif</option>
                            <option value="disabled">Dinonaktifkan</option>
                            <option value="expired">Kedaluwarsa</option>
                        </select>

                        <select
                            value={tagFilter}
                            onChange={(e) =>
                                handleFilterChange(statusFilter, e.target.value)
                            }
                            className="h-9 rounded-md border border-input bg-input/20 px-3 text-xs font-medium text-foreground outline-none focus:ring-2 focus:ring-ring"
                        >
                            <option value="">Semua Tag</option>
                            {tags.map((t) => (
                                <option key={t.id} value={t.slug}>
                                    {t.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Table Content */}
                <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/40 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                <tr>
                                    <th className="py-3.5 px-4">Slug & Judul</th>
                                    <th className="py-3.5 px-4">Tujuan</th>
                                    {isAdmin && (
                                        <th className="py-3.5 px-4">Pemilik</th>
                                    )}
                                    <th className="py-3.5 px-4">Status</th>
                                    <th className="py-3.5 px-4 text-center">Klik</th>
                                    <th className="py-3.5 px-4">Kadaluarsa</th>
                                    <th className="py-3.5 px-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                                {shortlinks.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={isAdmin ? 7 : 6}
                                            className="text-center py-12 text-muted-foreground"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Link2 className="size-8 text-muted-foreground/50" />
                                                <p className="font-medium">
                                                    Belum ada shortlink yang ditemukan.
                                                </p>
                                                <Link
                                                    href="/shortlinks/create"
                                                    className={buttonVariants({
                                                        variant: "outline",
                                                        size: "sm",
                                                        className: "mt-2",
                                                    })}
                                                >
                                                    Buat Shortlink Pertama
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    shortlinks.data.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-muted/20 transition-colors"
                                        >
                                            <td className="py-3.5 px-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-foreground tracking-tight">
                                                            /{item.slug}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                copyToClipboard(item.slug)
                                                            }
                                                            title="Salin tautan"
                                                            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted"
                                                        >
                                                            {copiedSlug === item.slug ? (
                                                                <Check className="size-3.5 text-emerald-500" />
                                                            ) : (
                                                                <Copy className="size-3.5" />
                                                            )}
                                                        </button>
                                                        {item.has_password && (
                                                            <span
                                                                title="Dilindungi kata sandi"
                                                                className="inline-flex items-center p-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                                            >
                                                                <Lock className="size-3" />
                                                            </span>
                                                        )}
                                                    </div>
                                                    {item.title && (
                                                        <p className="text-xs text-muted-foreground truncate max-w-xs font-normal">
                                                            {item.title}
                                                        </p>
                                                    )}
                                                    {item.tags && item.tags.length > 0 && (
                                                        <div className="flex flex-wrap gap-1 mt-0.5">
                                                            {item.tags.map((tag) => (
                                                                <span
                                                                    key={tag.id}
                                                                    className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-md bg-muted text-[10px] text-muted-foreground font-medium"
                                                                >
                                                                    <TagIcon className="size-2.5" />
                                                                    {tag.name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-1.5 max-w-[240px]">
                                                    <span
                                                        className="truncate text-xs text-muted-foreground"
                                                        title={item.destination_url}
                                                    >
                                                        {item.destination_url}
                                                    </span>
                                                    <a
                                                        href={item.destination_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-muted-foreground hover:text-foreground shrink-0"
                                                    >
                                                        <ExternalLink className="size-3" />
                                                    </a>
                                                </div>
                                            </td>

                                            {isAdmin && (
                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                        <User className="size-3.5" />
                                                        <span>{item.user?.name || "-"}</span>
                                                    </div>
                                                </td>
                                            )}

                                            <td className="py-3.5 px-4">
                                                {item.is_expired ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                                        Kedaluwarsa
                                                    </span>
                                                ) : item.status === "active" ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                                        Aktif
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-500/10 text-zinc-600 dark:text-zinc-400">
                                                        Dinonaktifkan
                                                    </span>
                                                )}
                                            </td>

                                            <td className="py-3.5 px-4 text-center">
                                                <span className="inline-flex items-center justify-center font-semibold text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                                                    {item.click_count.toLocaleString("id-ID")}
                                                </span>
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <Clock className="size-3.5" />
                                                    <span>
                                                        {item.expires_at
                                                            ? new Date(
                                                                  item.expires_at
                                                              ).toLocaleDateString(
                                                                  "id-ID",
                                                                  {
                                                                      day: "numeric",
                                                                      month: "short",
                                                                      year: "numeric",
                                                                  }
                                                              )
                                                            : "Selamanya"}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="py-3.5 px-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link
                                                        href={`/shortlinks/${item.id}`}
                                                        className={buttonVariants({
                                                            variant: "ghost",
                                                            size: "icon-xs",
                                                        })}
                                                        title="Detail & QR Code"
                                                    >
                                                        <QrCode className="size-3.5" />
                                                    </Link>

                                                    <Link
                                                        href={`/shortlinks/${item.id}/edit`}
                                                        className={buttonVariants({
                                                            variant: "ghost",
                                                            size: "icon-xs",
                                                        })}
                                                        title="Edit Shortlink"
                                                    >
                                                        <Edit className="size-3.5" />
                                                    </Link>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon-xs"
                                                        onClick={() => toggleStatus(item.id)}
                                                        title={
                                                            item.status === "active"
                                                                ? "Nonaktifkan"
                                                                : "Aktifkan"
                                                        }
                                                        className={
                                                            item.status === "active"
                                                                ? "text-muted-foreground hover:text-amber-600"
                                                                : "text-muted-foreground hover:text-emerald-600"
                                                        }
                                                    >
                                                        <Power className="size-3.5" />
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon-xs"
                                                        onClick={() =>
                                                            deleteShortlink(
                                                                item.id,
                                                                item.slug
                                                            )
                                                        }
                                                        title="Hapus Shortlink"
                                                        className="text-muted-foreground hover:text-destructive"
                                                    >
                                                        <Trash2 className="size-3.5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {shortlinks.links && shortlinks.links.length > 3 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
                            <span className="text-xs text-muted-foreground">
                                Menampilkan {shortlinks.from || 0} -{" "}
                                {shortlinks.to || 0} dari {shortlinks.total} data
                            </span>
                            <div className="flex gap-1">
                                {shortlinks.links.map((link, idx) =>
                                    link.url ? (
                                        <Link
                                            key={idx}
                                            href={link.url}
                                            className={buttonVariants({
                                                variant: link.active ? "default" : "outline",
                                                size: "xs",
                                            })}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ) : (
                                        <span
                                            key={idx}
                                            className={buttonVariants({
                                                variant: "outline",
                                                size: "xs",
                                                className: "opacity-50 pointer-events-none",
                                            })}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
