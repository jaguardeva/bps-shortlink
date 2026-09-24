import React, { useState } from "react";
import { Link, useForm } from "@inertiajs/react";
import AppLayout from "@/components/layouts/AppLayout";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    ArrowLeft,
    Globe,
    Lock,
    Calendar,
    Tag as TagIcon,
    Loader2,
    Shield,
} from "lucide-react";
import type { Tag } from "@/types";

interface EditShortlinkProps {
    shortlink: {
        id: string;
        slug: string;
        title: string | null;
        description: string | null;
        destination_url: string;
        has_password: boolean;
        status: "active" | "disabled" | "expired";
        expires_at: string;
        tag_ids: string[];
    };
    tags: Tag[];
    appUrl: string;
}

export default function EditShortlink({
    shortlink,
    tags,
    appUrl,
}: EditShortlinkProps) {
    const { data, setData, put, processing, errors } = useForm({
        destination_url: shortlink.destination_url,
        slug: shortlink.slug,
        title: shortlink.title || "",
        description: shortlink.description || "",
        password: "",
        remove_password: false,
        expires_at: shortlink.expires_at || "",
        tags: shortlink.tag_ids || [],
        status: shortlink.status,
    });

    const [changePassword, setChangePassword] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/shortlinks/${shortlink.id}`);
    };

    const toggleTag = (tagId: string) => {
        if (data.tags.includes(tagId)) {
            setData("tags", data.tags.filter((id) => id !== tagId));
        } else {
            setData("tags", [...data.tags, tagId]);
        }
    };

    return (
        <AppLayout
            title={`Edit Shortlink /${shortlink.slug}`}
            breadcrumbs={[
                { label: "Kelola Tautan", href: "/shortlinks" },
                { label: `/${shortlink.slug}`, href: `/shortlinks/${shortlink.id}` },
                { label: "Edit" },
            ]}
        >
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-foreground">
                            Edit Shortlink
                        </h1>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Perbarui informasi tautan /{shortlink.slug}
                        </p>
                    </div>

                    <Link
                        href={`/shortlinks/${shortlink.id}`}
                        className={buttonVariants({ variant: "outline", size: "sm" })}
                    >
                        <ArrowLeft className="size-4 mr-1.5" />
                        Kembali
                    </Link>
                </div>

                <div className="bg-card rounded-2xl border border-border/60 shadow-sm p-6 sm:p-8">
                    <form onSubmit={submit} className="space-y-6">
                        {/* Destination URL */}
                        <div className="space-y-2">
                            <label
                                htmlFor="destination_url"
                                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                            >
                                URL Tujuan <span className="text-destructive">*</span>
                            </label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                                <Input
                                    id="destination_url"
                                    type="url"
                                    value={data.destination_url}
                                    onChange={(e) =>
                                        setData("destination_url", e.target.value)
                                    }
                                    placeholder="https://bps.go.id/publikasi/..."
                                    className="pl-9 h-10"
                                    required
                                    autoFocus
                                />
                            </div>
                            {errors.destination_url && (
                                <p className="text-xs text-destructive mt-1">
                                    {errors.destination_url}
                                </p>
                            )}
                        </div>

                        {/* Custom Slug */}
                        <div className="space-y-2">
                            <label
                                htmlFor="slug"
                                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                            >
                                Slug <span className="text-destructive">*</span>
                            </label>
                            <div className="flex rounded-xl border border-input bg-input/20 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20 overflow-hidden">
                                <span className="inline-flex items-center px-3.5 text-xs font-medium text-muted-foreground bg-muted/60 border-r border-input">
                                    {appUrl.replace(/^https?:\/\//, "")}/
                                </span>
                                <input
                                    id="slug"
                                    type="text"
                                    value={data.slug}
                                    onChange={(e) => setData("slug", e.target.value)}
                                    placeholder="sensus2026"
                                    className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
                                    required
                                />
                            </div>
                            {errors.slug && (
                                <p className="text-xs text-destructive mt-1">
                                    {errors.slug}
                                </p>
                            )}
                        </div>

                        {/* Status */}
                        <div className="space-y-2">
                            <label
                                htmlFor="status"
                                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                            >
                                Status Tautan
                            </label>
                            <select
                                id="status"
                                value={data.status}
                                onChange={(e) =>
                                    setData(
                                        "status",
                                        e.target.value as "active" | "disabled" | "expired"
                                    )
                                }
                                className="h-10 w-full rounded-md border border-input bg-input/20 px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                            >
                                <option value="active">Aktif (Dapat diakses)</option>
                                <option value="disabled">Dinonaktifkan</option>
                                <option value="expired">Kedaluwarsa</option>
                            </select>
                        </div>

                        {/* Title & Description */}
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <label
                                    htmlFor="title"
                                    className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                                >
                                    Judul / Label Tautan
                                </label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData("title", e.target.value)}
                                    placeholder="Contoh: Publikasi Sensus Pertanian 2026"
                                    className="h-10"
                                />
                                {errors.title && (
                                    <p className="text-xs text-destructive mt-1">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="description"
                                    className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                                >
                                    Deskripsi / Catatan
                                </label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    rows={2}
                                />
                                {errors.description && (
                                    <p className="text-xs text-destructive mt-1">
                                        {errors.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Tags */}
                        {tags.length > 0 && (
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                    <TagIcon className="size-3.5" />
                                    Kategori & Tag
                                </label>
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {tags.map((tag) => {
                                        const isSelected = data.tags.includes(tag.id);
                                        return (
                                            <button
                                                key={tag.id}
                                                type="button"
                                                onClick={() => toggleTag(tag.id)}
                                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                                                    isSelected
                                                        ? "bg-primary text-primary-foreground border-primary"
                                                        : "bg-muted/40 text-muted-foreground border-border hover:bg-muted"
                                                }`}
                                            >
                                                {tag.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div className="border-t border-border/60 pt-5 space-y-4">
                            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <Shield className="size-4 text-primary" />
                                Pengaturan Keamanan & Kadaluarsa
                            </h3>

                            {/* Password Protection */}
                            <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
                                        <Lock className="size-3.5 text-muted-foreground" />
                                        Perlindungan Kata Sandi
                                    </span>
                                    {shortlink.has_password && !data.remove_password && (
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-medium">
                                            Saat ini dilindungi sandi
                                        </span>
                                    )}
                                </div>

                                {shortlink.has_password && (
                                    <div className="pt-1">
                                        <label className="flex items-center gap-2 cursor-pointer text-xs text-destructive">
                                            <input
                                                type="checkbox"
                                                checked={data.remove_password}
                                                onChange={(e) =>
                                                    setData(
                                                        "remove_password",
                                                        e.target.checked
                                                    )
                                                }
                                                className="rounded border-input text-destructive"
                                            />
                                            Hapus perlindungan kata sandi
                                        </label>
                                    </div>
                                )}

                                {(!shortlink.has_password ||
                                    (!data.remove_password && changePassword)) && (
                                    <div className="pt-2">
                                        <Input
                                            type="password"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData("password", e.target.value)
                                            }
                                            placeholder="Masukkan kata sandi baru..."
                                            className="h-9 max-w-sm"
                                        />
                                        {errors.password && (
                                            <p className="text-xs text-destructive mt-1">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {shortlink.has_password &&
                                    !data.remove_password &&
                                    !changePassword && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="xs"
                                            onClick={() => setChangePassword(true)}
                                        >
                                            Ubah Kata Sandi
                                        </Button>
                                    )}
                            </div>

                            {/* Expiration */}
                            <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-2">
                                <label
                                    htmlFor="expires_at"
                                    className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"
                                >
                                    <Calendar className="size-3.5" />
                                    Waktu Kedaluwarsa
                                </label>
                                <Input
                                    id="expires_at"
                                    type="datetime-local"
                                    value={data.expires_at}
                                    onChange={(e) =>
                                        setData("expires_at", e.target.value)
                                    }
                                    className="h-9 max-w-sm"
                                />
                                <p className="text-[11px] text-muted-foreground">
                                    Kosongkan jika tautan berlaku selamanya.
                                </p>
                                {errors.expires_at && (
                                    <p className="text-xs text-destructive mt-1">
                                        {errors.expires_at}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="pt-4 flex items-center justify-end gap-3 border-t border-border">
                            <Link
                                href={`/shortlinks/${shortlink.id}`}
                                className={buttonVariants({ variant: "outline" })}
                            >
                                Batal
                            </Link>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="min-w-32"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="mr-2 size-4 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    "Simpan Perubahan"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
