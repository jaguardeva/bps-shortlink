import React from "react";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { FileQuestion, Home } from "lucide-react";

interface NotFoundProps {
    message?: string;
}

export default function NotFound({ message }: NotFoundProps) {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-radial-[at_50%_0%] from-sky-50 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 p-4 sm:p-6 lg:p-8">
            <Head title="404 - Tautan Tidak Ditemukan" />

            <div className="w-full max-w-md text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-amber-500/10 text-amber-500 shadow-sm mb-6 ring-1 ring-amber-500/20">
                    <FileQuestion className="w-10 h-10" />
                </div>

                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                    404
                </h1>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mt-2">
                    Tautan Tidak Ditemukan
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xs mx-auto">
                    {message || "Tautan pendek yang Anda tuju mungkin sudah dihapus atau tidak pernah ada."}
                </p>

                <div className="mt-8">
                    <Button asChild variant="outline" className="gap-2">
                        <Link href="/dashboard">
                            <Home className="w-4 h-4" />
                            <span>Kembali ke Beranda</span>
                        </Link>
                    </Button>
                </div>

                <div className="mt-12 text-xs text-slate-400 dark:text-slate-600">
                    &copy; {new Date().getFullYear()} BPS Kabupaten Mojokerto.
                </div>
            </div>
        </div>
    );
}
