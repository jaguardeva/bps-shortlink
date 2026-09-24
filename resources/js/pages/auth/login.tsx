import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Link2, Lock, Mail, ShieldAlert, Loader2 } from "lucide-react";

interface LoginProps {
    status?: string;
}

export default function Login({ status }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/login", {
            onFinish: () => reset("password"),
        });
    };

    console.log(data);

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-radial-[at_50%_0%] from-sky-50 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 p-4 sm:p-6 lg:p-8">
            <Head title="Masuk - BPS Mojokerto Shortlink" />

            <div className="w-full max-w-md">
                {/* Brand Header */}
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="size-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25 mb-4 ring-8 ring-primary/10">
                        <Link2 className="size-7 text-primary-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        BPS Mojokerto Shortlink
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Sistem Pengelolaan & Monitoring Tautan Internal
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-card text-card-foreground border border-border/60 shadow-xl rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
                    {status && (
                        <div className="mb-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm text-emerald-600 dark:text-emerald-400">
                            {status}
                        </div>
                    )}

                    {errors.email && errors.email.includes("ditangguhkan") && (
                        <div className="mb-6 rounded-lg bg-destructive/10 border border-destructive/20 p-3 flex items-start gap-2.5 text-sm text-destructive">
                            <ShieldAlert className="size-5 shrink-0 mt-0.5" />
                            <span>{errors.email}</span>
                        </div>
                    )}

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
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    placeholder="nama@bps.go.id"
                                    className="pl-9"
                                    autoComplete="username"
                                    autoFocus
                                    required
                                />
                            </div>
                            {errors.email &&
                                !errors.email.includes("ditangguhkan") && (
                                    <p className="text-xs text-destructive mt-1">
                                        {errors.email}
                                    </p>
                                )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                                >
                                    Kata Sandi
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-xs text-primary hover:underline font-medium"
                                >
                                    Lupa kata sandi?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    placeholder="••••••••"
                                    className="pl-9"
                                    autoComplete="current-password"
                                    required
                                />
                            </div>
                            {errors.password && (
                                <p className="text-xs text-destructive mt-1">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <Checkbox
                                    checked={data.remember}
                                    onCheckedChange={(checked) =>
                                        setData("remember", Boolean(checked))
                                    }
                                />
                                <span className="text-sm text-muted-foreground">
                                    Ingat saya
                                </span>
                            </label>
                        </div>

                        <Button
                            type="submit"
                            className="w-full mt-2 h-10 font-semibold"
                            disabled={processing}
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                    Memproses...
                                </>
                            ) : (
                                "Masuk ke Dashboard"
                            )}
                        </Button>
                    </form>
                </div>

                {/* Footer Info */}
                <p className="text-center text-xs text-muted-foreground mt-8">
                    &copy; {new Date().getFullYear()} Badan Pusat Statistik
                    Kabupaten Mojokerto.
                    <br />
                    Akses terbatas untuk pegawai dan admin internal.
                </p>
            </div>
        </div>
    );
}
