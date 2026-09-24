import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AppLayout from "@/components/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Mail, Lock, User as UserIcon, Loader2, Save } from "lucide-react";
import { User, Role } from "@/types/auth";

interface EditUserProps {
    targetUser: User;
    roles: Role[];
}

export default function EditUser({ targetUser, roles }: EditUserProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.roles?.[0]?.id || roles[0]?.id || "",
        status: targetUser.status,
        password: "",
        password_confirmation: "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/users/${targetUser.id}`);
    };

    return (
        <AppLayout
            title={`Edit Pengguna: ${targetUser.name}`}
            breadcrumbs={[
                { label: "Kelola Pengguna", href: "/admin/users" },
                { label: targetUser.name, href: `/admin/users/${targetUser.id}` },
                { label: "Edit" },
            ]}
        >
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-3">
                    <Button asChild variant="ghost" size="icon" className="h-9 w-9">
                        <Link href="/admin/users">
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            Edit Pengguna
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Perbarui informasi akun dan hak akses pengguna
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                    <form onSubmit={submit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Nama Lengkap
                            </label>
                            <div className="relative">
                                <Input
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    required
                                    className="pl-9.5 text-xs"
                                />
                                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                            {errors.name && <p className="text-xs text-rose-500">{errors.name}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Alamat Email
                            </label>
                            <div className="relative">
                                <Input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                    required
                                    className="pl-9.5 text-xs"
                                />
                                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                            {errors.email && <p className="text-xs text-rose-500">{errors.email}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Peran (Role)
                                </label>
                                <select
                                    value={data.role}
                                    onChange={(e) => setData("role", e.target.value)}
                                    className="w-full h-9 px-3 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-primary/20 text-slate-700 dark:text-slate-300"
                                >
                                    {roles.map((r) => (
                                        <option key={r.id} value={r.id}>
                                            {r.name.toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                                {errors.role && <p className="text-xs text-rose-500">{errors.role}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Status Akun
                                </label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData("status", e.target.value as any)}
                                    className="w-full h-9 px-3 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-primary/20 text-slate-700 dark:text-slate-300"
                                >
                                    <option value="active">Aktif</option>
                                    <option value="inactive">Nonaktif</option>
                                    <option value="suspended">Ditangguhkan</option>
                                </select>
                                {errors.status && <p className="text-xs text-rose-500">{errors.status}</p>}
                            </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                            <p className="text-xs text-slate-500 mb-3">
                                Kosongkan kata sandi jika tidak ingin mengubah kata sandi pengguna.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Kata Sandi Baru (Opsional)
                                    </label>
                                    <div className="relative">
                                        <Input
                                            type="password"
                                            placeholder="Minimal 8 karakter"
                                            value={data.password}
                                            onChange={(e) => setData("password", e.target.value)}
                                            className="pl-9.5 text-xs"
                                        />
                                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    </div>
                                    {errors.password && <p className="text-xs text-rose-500">{errors.password}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Konfirmasi Kata Sandi
                                    </label>
                                    <div className="relative">
                                        <Input
                                            type="password"
                                            placeholder="Ulangi kata sandi"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData("password_confirmation", e.target.value)}
                                            className="pl-9.5 text-xs"
                                        />
                                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <Button asChild variant="outline" type="button">
                                <Link href="/admin/users">Batal</Link>
                            </Button>
                            <Button type="submit" disabled={processing} className="gap-2">
                                {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                <span>Simpan Perubahan</span>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
