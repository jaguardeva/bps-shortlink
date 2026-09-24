import React, { useState } from "react";
import { Link, useForm } from "@inertiajs/react";
import AppLayout from "@/components/layouts/AppLayout";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    ArrowLeft,
    Globe,
    Sparkles,
    Lock,
    Calendar,
    Tag as TagIcon,
    Loader2,
    Shield,
} from "lucide-react";
import type { Tag } from "@/types";

interface CreateShortlinkProps {
    tags: Tag[];
    appUrl: string;
}

export default function CreateShortlink({ tags, appUrl }: CreateShortlinkProps) {
    const { data, setData, post, processing, errors } = useForm({
        destination_url: "",
        slug: "",
        title: "",
        description: "",
        password: "",
        expires_at: "",
        tags: [] as string[],
        status: "active",
    });

    const [hasPassword, setHasPassword] = useState(false);
    const [hasExpiration, setHasExpiration] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/shortlinks");
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
            title="Buat Shortlink Baru"
            breadcrumbs={[
                { label: "Shortlinks", href: "/shortlinks" },
                { label: "Buat Baru" },
            ]}
        >
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-foreground">
                            Buat Shortlink Baru
                        </h1>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Konversi URL panjang menjadi tautan singkat dengan pelacakan analitik.
                        </p>
                    </div>

                    <Link
                        href="/shortlinks"
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
                                    onChange={(e) => setData("destination_url", e.target.value)}
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
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="slug"
                                    className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                                >
                                    Kustom Slug (Opsional)
                                </label>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Sparkles className="size-3 text-amber-500" />
                                    Biarkan kosong untuk slug otomatis
                                </span>
                            </div>
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
                                />
                            </div>
                            {errors.slug && (
                                <p className="text-xs text-destructive mt-1">
                                    {errors.slug}
                                </p>
                            )}
                        </div>

                        {/* Title & Description */}
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <label
                                    htmlFor="title"
                                    className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                                >
                                    Judul / Label Tautan (Opsional)
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
                                    Deskripsi / Catatan (Opsional)
                                </label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData("description", e.target.value)}
                                    placeholder="Catatan tambahan mengenai penggunaan shortlink ini..."
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

                            {/* Password Protection Toggle */}
                            <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-3">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={hasPassword}
                                        onChange={(e) => {
                                            setHasPassword(e.target.checked);
                                            if (!e.target.checked) setData("password", "");
                                        }}
                                        className="rounded border-input text-primary focus:ring-ring"
                                    />
                                    <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
                                        <Lock className="size-3.5 text-muted-foreground" />
                                        Lindungi dengan Kata Sandi
                                    </span>
                                </label>

                                {hasPassword && (
                                    <div className="pt-2 pl-6">
                                        <Input
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData("password", e.target.value)}
                                            placeholder="Masukkan kata sandi akses..."
                                            className="h-9 max-w-sm"
                                        />
                                        <p className="text-[11px] text-muted-foreground mt-1">
                                            Pengunjung harus memasukkan sandi ini sebelum dialihkan ke URL tujuan.
                                        </p>
                                        {errors.password && (
                                            <p className="text-xs text-destructive mt-1">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Expiration Toggle */}
                            <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-3">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={hasExpiration}
                                        onChange={(e) => {
                                            setHasExpiration(e.target.checked);
                                            if (!e.target.checked) setData("expires_at", "");
                                        }}
                                        className="rounded border-input text-primary focus:ring-ring"
                                    />
                                    <span className="text-sm font-medium text-foreground flex items-center gap-1.5">
                                        <Calendar className="size-3.5 text-muted-foreground" />
                                        Tetapkan Waktu Kedaluwarsa
                                    </span>
                                </label>

                                {hasExpiration && (
                                    <div className="pt-2 pl-6">
                                        <Input
                                            type="datetime-local"
                                            value={data.expires_at}
                                            onChange={(e) => setData("expires_at", e.target.value)}
                                            className="h-9 max-w-sm"
                                        />
                                        <p className="text-[11px] text-muted-foreground mt-1">
                                            Tautan tidak akan bisa diakses setelah waktu ini.
                                        </p>
                                        {errors.expires_at && (
                                            <p className="text-xs text-destructive mt-1">
                                                {errors.expires_at}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-4 flex items-center justify-end gap-3 border-t border-border">
                            <Link
                                href="/shortlinks"
                                className={buttonVariants({ variant: "outline" })}
                            >
                                Batal
                            </Link>
                            <Button type="submit" disabled={processing} className="min-w-32">
                                {processing ? (
                                    <>
                                        <Loader2 className="mr-2 size-4 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    "Buat Shortlink"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
