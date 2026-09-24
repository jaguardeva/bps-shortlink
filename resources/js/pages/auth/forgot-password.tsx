import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, KeyRound, Mail, Loader2 } from "lucide-react";

interface ForgotPasswordProps {
    status?: string;
}

export default function ForgotPassword({ status }: ForgotPasswordProps) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/forgot-password");
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-radial-[at_50%_0%] from-sky-50 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 p-4 sm:p-6 lg:p-8">
            <Head title="Lupa Kata Sandi - BPS Mojokerto Shortlink" />

            <div className="w-full max-w-md">
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="size-14 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/25 mb-4 ring-8 ring-amber-500/10">
                        <KeyRound className="size-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Pemulihan Kata Sandi
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                        Masukkan email Anda dan kami akan mengirimkan tautan reset kata sandi.
                    </p>
                </div>

                <div className="bg-card text-card-foreground border border-border/60 shadow-xl rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
                    {status && (
                        <div className="mb-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-sm text-emerald-600 dark:text-emerald-400">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                            >
                                Email Terdaftar
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
                                    autoFocus
                                    required
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-destructive mt-1">
                                    {errors.email}
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
                                    Mengirimkan Link...
                                </>
                            ) : (
                                "Kirim Tautan Reset"
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
