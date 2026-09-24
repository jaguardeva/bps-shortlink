import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Lock, Mail, ShieldCheck, Loader2 } from "lucide-react";

interface ResetPasswordProps {
    token: string;
    email?: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email || "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/reset-password", {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-radial-[at_50%_0%] from-sky-50 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 p-4 sm:p-6 lg:p-8">
            <Head title="Buat Kata Sandi Baru - BPS Mojokerto Shortlink" />

            <div className="w-full max-w-md">
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="size-14 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/25 mb-4 ring-8 ring-emerald-600/10">
                        <ShieldCheck className="size-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Atur Ulang Kata Sandi
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                        Masukkan kata sandi baru untuk akun BPS Mojokerto Shortlink Anda.
                    </p>
                </div>

                <div className="bg-card text-card-foreground border border-border/60 shadow-xl rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                            >
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                    placeholder="nama@bps.go.id"
                                    className="pl-9"
                                    required
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-destructive mt-1">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="password"
                                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                            >
                                Kata Sandi Baru
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData("password", e.target.value)}
                                    placeholder="••••••••"
                                    className="pl-9"
                                    autoFocus
                                    required
                                />
                            </div>
                            {errors.password && (
                                <p className="text-xs text-destructive mt-1">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="password_confirmation"
                                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                            >
                                Konfirmasi Kata Sandi Baru
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData("password_confirmation", e.target.value)
                                    }
                                    placeholder="••••••••"
                                    className="pl-9"
                                    required
                                />
                            </div>
                            {errors.password_confirmation && (
                                <p className="text-xs text-destructive mt-1">
                                    {errors.password_confirmation}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full mt-2 h-10 font-semibold"
                            disabled={processing}
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                    Menyimpan Kata Sandi...
                                </>
                            ) : (
                                "Simpan Kata Sandi Baru"
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="size-3.5" />
                            Kembali ke halaman masuk
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
