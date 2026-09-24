import React from "react";
import { Head, useForm } from "@inertiajs/react";
import AppLayout from "@/components/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, Shield, BarChart3, Save, CheckCircle2, Loader2, Link2 } from "lucide-react";

interface SettingItem {
    key: string;
    value: any;
    type: string;
    description: string | null;
}

interface SettingsIndexProps {
    settings: Record<string, SettingItem>;
}

export default function SettingsIndex({ settings }: SettingsIndexProps) {
    const { data, setData, put, processing, wasSuccessful } = useForm({
        settings: {
            app_name: settings.app_name?.value ?? "BPS Mojokerto Shortlink",
            default_shortlink_length: settings.default_shortlink_length?.value ?? 6,
            allow_custom_slug: settings.allow_custom_slug?.value ?? true,
            max_login_attempts: settings.max_login_attempts?.value ?? 5,
            password_min_length: settings.password_min_length?.value ?? 8,
            analytics_retention_days: settings.analytics_retention_days?.value ?? 365,
        },
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put("/admin/settings");
    };

    return (
        <AppLayout
            title="Pengaturan Sistem"
            breadcrumbs={[{ label: "Pengaturan Sistem" }]}
        >
            <div className="max-w-3xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        Pengaturan Sistem
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Konfigurasi parameter operasional dan kebijakan platform shortlink
                    </p>
                </div>

                {wasSuccessful && (
                    <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>Pengaturan berhasil diperbarui.</span>
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    {/* General Settings */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
                        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                            <Link2 className="w-4 h-4 text-primary" />
                            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                                Pengaturan Tautan Umum
                            </h2>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Nama Aplikasi Platform
                            </label>
                            <Input
                                value={data.settings.app_name}
                                onChange={(e) =>
                                    setData("settings", { ...data.settings, app_name: e.target.value })
                                }
                                className="text-xs"
                            />
                            <p className="text-[11px] text-slate-400">
                                Nama yang muncul pada header, email, dan meta tag.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Panjang Slug Otomatis (Karakter)
                                </label>
                                <Input
                                    type="number"
                                    min={4}
                                    max={32}
                                    value={data.settings.default_shortlink_length}
                                    onChange={(e) =>
                                        setData("settings", {
                                            ...data.settings,
                                            default_shortlink_length: parseInt(e.target.value) || 6,
                                        })
                                    }
                                    className="text-xs"
                                />
                                <p className="text-[11px] text-slate-400">
                                    Panjang acak karakter saat slug khusus tidak diisi (standar: 6).
                                </p>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Izinkan Slug Kustom
                                </label>
                                <select
                                    value={data.settings.allow_custom_slug ? "1" : "0"}
                                    onChange={(e) =>
                                        setData("settings", {
                                            ...data.settings,
                                            allow_custom_slug: e.target.value === "1",
                                        })
                                    }
                                    className="w-full h-9 px-3 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300"
                                >
                                    <option value="1">Diizinkan (Pengguna bisa membuat custom alias)</option>
                                    <option value="0">Hanya Slug Acak Sistem</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Security Settings */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
                        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                            <Shield className="w-4 h-4 text-primary" />
                            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                                Keamanan & Akses
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Batas Percobaan Login (Rate Limit)
                                </label>
                                <Input
                                    type="number"
                                    min={3}
                                    max={20}
                                    value={data.settings.max_login_attempts}
                                    onChange={(e) =>
                                        setData("settings", {
                                            ...data.settings,
                                            max_login_attempts: parseInt(e.target.value) || 5,
                                        })
                                    }
                                    className="text-xs"
                                />
                                <p className="text-[11px] text-slate-400">
                                    Maksimal kegagalan login berturut-turut sebelum diblokir sementara.
                                </p>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Panjang Minimal Kata Sandi
                                </label>
                                <Input
                                    type="number"
                                    min={6}
                                    max={32}
                                    value={data.settings.password_min_length}
                                    onChange={(e) =>
                                        setData("settings", {
                                            ...data.settings,
                                            password_min_length: parseInt(e.target.value) || 8,
                                        })
                                    }
                                    className="text-xs"
                                />
                                <p className="text-[11px] text-slate-400">
                                    Standar keamanan kata sandi pengguna baru (standar: 8).
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Analytics Settings */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
                        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                            <BarChart3 className="w-4 h-4 text-primary" />
                            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                                Data & Retensi Analisis
                            </h2>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Masa Simpan Log Klik (Hari)
                            </label>
                            <Input
                                type="number"
                                min={30}
                                max={3650}
                                value={data.settings.analytics_retention_days}
                                onChange={(e) =>
                                    setData("settings", {
                                        ...data.settings,
                                        analytics_retention_days: parseInt(e.target.value) || 365,
                                    })
                                }
                                className="text-xs"
                            />
                            <p className="text-[11px] text-slate-400">
                                Jumlah hari penyimpanan riwayat klik event sebelum diarsipkan (standar: 365 hari).
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Button type="submit" disabled={processing} className="gap-2 shadow-xs">
                            {processing ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Menyimpan...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    <span>Simpan Pengaturan</span>
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
