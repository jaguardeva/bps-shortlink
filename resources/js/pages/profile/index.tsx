import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AppLayout from "@/components/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Shield, Lock, Clock, CheckCircle2, Loader2, Save } from "lucide-react";

interface ProfileProps {
    user: {
        id: string;
        name: string;
        email: string;
        status: string;
        roles: string[];
        last_login_at: string | null;
        last_login_ip: string | null;
        created_at: string | null;
    };
}

export default function ProfileIndex({ user }: ProfileProps) {
    // Profile info form
    const profileForm = useForm({
        name: user.name,
        email: user.email,
    });

    // Password form
    const passwordForm = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const submitProfile = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.put("/profile");
    };

    const submitPassword = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.put("/profile/password", {
            onSuccess: () => passwordForm.reset(),
        });
    };

    return (
        <AppLayout
            title="Profil Pengguna"
            breadcrumbs={[{ label: "Profil Akun" }]}
        >
            <div className="max-w-3xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        Profil Akun Saya
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Kelola data diri, kredensial login, dan informasi keamanan akun Anda
                    </p>
                </div>

                {/* Account info overview badge */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                            {user.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <div className="font-bold text-slate-900 dark:text-slate-100 text-base">
                                {user.name}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                                {user.email}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {user.roles.map((role) => (
                            <span
                                key={role}
                                className="px-2.5 py-1 rounded-lg text-xs font-semibold uppercase font-mono bg-primary/10 text-primary border border-primary/20"
                            >
                                <Shield className="w-3 h-3 inline mr-1" />
                                {role}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Profile Information Form */}
                <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                            Informasi Profil
                        </h2>
                        <p className="text-xs text-slate-400">
                            Perbarui nama lengkap dan alamat surel aktif Anda
                        </p>
                    </div>

                    {profileForm.wasSuccessful && (
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span>Profil berhasil diperbarui.</span>
                        </div>
                    )}

                    <form onSubmit={submitProfile} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Nama Lengkap
                            </label>
                            <Input
                                value={profileForm.data.name}
                                onChange={(e) => profileForm.setData("name", e.target.value)}
                                required
                                className="text-xs"
                            />
                            {profileForm.errors.name && (
                                <p className="text-xs text-rose-500">{profileForm.errors.name}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Alamat Email
                            </label>
                            <Input
                                type="email"
                                value={profileForm.data.email}
                                onChange={(e) => profileForm.setData("email", e.target.value)}
                                required
                                className="text-xs"
                            />
                            {profileForm.errors.email && (
                                <p className="text-xs text-rose-500">{profileForm.errors.email}</p>
                            )}
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button type="submit" disabled={profileForm.processing} className="gap-2">
                                {profileForm.processing && <Loader2 className="w-4 h-4 animate-spin" />}
                                <span>Simpan Profil</span>
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Password Change Form */}
                <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
                    <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                            Ubah Kata Sandi
                        </h2>
                        <p className="text-xs text-slate-400">
                            Gunakan kombinasi minimal 8 karakter untuk keamanan akun
                        </p>
                    </div>

                    {passwordForm.wasSuccessful && (
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span>Kata sandi berhasil diperbarui.</span>
                        </div>
                    )}

                    <form onSubmit={submitPassword} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Kata Sandi Saat Ini
                            </label>
                            <Input
                                type="password"
                                value={passwordForm.data.current_password}
                                onChange={(e) => passwordForm.setData("current_password", e.target.value)}
                                required
                                className="text-xs"
                            />
                            {passwordForm.errors.current_password && (
                                <p className="text-xs text-rose-500">{passwordForm.errors.current_password}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Kata Sandi Baru
                                </label>
                                <Input
                                    type="password"
                                    value={passwordForm.data.password}
                                    onChange={(e) => passwordForm.setData("password", e.target.value)}
                                    required
                                    className="text-xs"
                                />
                                {passwordForm.errors.password && (
                                    <p className="text-xs text-rose-500">{passwordForm.errors.password}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Konfirmasi Kata Sandi Baru
                                </label>
                                <Input
                                    type="password"
                                    value={passwordForm.data.password_confirmation}
                                    onChange={(e) =>
                                        passwordForm.setData("password_confirmation", e.target.value)
                                    }
                                    required
                                    className="text-xs"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button type="submit" disabled={passwordForm.processing} className="gap-2">
                                {passwordForm.processing && <Loader2 className="w-4 h-4 animate-spin" />}
                                <span>Perbarui Kata Sandi</span>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
