import React from "react";
import { Head, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, ShieldAlert, ArrowRight, Loader2, Link2 } from "lucide-react";

interface ShortlinkPasswordProps {
    slug: string;
    title: string;
    description: string | null;
}

export default function ShortlinkPassword({ slug, title, description }: ShortlinkPasswordProps) {
    const { data, setData, post, processing, errors } = useForm({
        password: "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/${slug}/password`);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-radial-[at_50%_0%] from-sky-50 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 p-4 sm:p-6 lg:p-8">
            <Head title={`Dilindungi Kata Sandi - ${title}`} />

            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary shadow-sm mb-4 ring-1 ring-primary/20">
                        <Lock className="w-7 h-7" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        Tautan Dilindungi
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Masukkan kata sandi untuk mengakses tujuan tautan ini
                    </p>
                </div>

                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 space-y-6">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            <Link2 className="w-3.5 h-3.5 text-primary" />
                            <span>Tautan Pendek</span>
                        </div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200 break-words">
                            {title}
                        </p>
                        {description && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                                {description}
                            </p>
                        )}
                        <p className="text-xs text-primary font-mono pt-1">
                            link.kanal3516.site/{slug}
                        </p>
                    </div>

                    {errors.password && (
                        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-400 text-sm">
                            <ShieldAlert className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
                            <span>{errors.password}</span>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-2">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                            >
                                Kata Sandi
                            </label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Masukkan kata sandi tautan"
                                    value={data.password}
                                    onChange={(e) => setData("password", e.target.value)}
                                    autoFocus
                                    required
                                    className="pr-10"
                                />
                                <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full font-semibold gap-2 shadow-sm"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Memverifikasi...</span>
                                </>
                            ) : (
                                <>
                                    <span>Buka Tautan</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </Button>
                    </form>
                </div>

                <div className="text-center mt-8 text-xs text-slate-400 dark:text-slate-600">
                    &copy; {new Date().getFullYear()} BPS Kabupaten Mojokerto. Kanal 3516.
                </div>
            </div>
        </div>
    );
}
