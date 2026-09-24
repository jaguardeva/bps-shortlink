import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AppLayout from "@/components/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Shield, Check, Lock, CheckCircle2, Save, Loader2 } from "lucide-react";

interface PermissionItem {
    id: string;
    name: string;
    guard_name: string;
}

interface RoleItem {
    id: string;
    name: string;
    guard_name: string;
    permissions: PermissionItem[];
}

interface RolesIndexProps {
    roles: RoleItem[];
    permissions: PermissionItem[];
}

export default function RolesIndex({ roles, permissions }: RolesIndexProps) {
    const [selectedRole, setSelectedRole] = useState<RoleItem>(roles[0] || null);
    const [selectedPermIds, setSelectedPermIds] = useState<string[]>(
        roles[0]?.permissions.map((p) => p.id) || []
    );
    const [processing, setProcessing] = useState(false);

    const handleSelectRole = (r: RoleItem) => {
        setSelectedRole(r);
        setSelectedPermIds(r.permissions.map((p) => p.id));
    };

    const togglePermission = (permId: string) => {
        if (selectedRole?.name === "admin") {
            return; // Admin role has full access
        }
        if (selectedPermIds.includes(permId)) {
            setSelectedPermIds(selectedPermIds.filter((id) => id !== permId));
        } else {
            setSelectedPermIds([...selectedPermIds, permId]);
        }
    };

    const handleSave = () => {
        if (!selectedRole) return;
        setProcessing(true);
        router.put(
            `/admin/roles/${selectedRole.id}`,
            { permissions: selectedPermIds },
            {
                onFinish: () => setProcessing(false),
            }
        );
    };

    return (
        <AppLayout
            title="Kelola Peran & Izin"
            breadcrumbs={[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Pengguna", href: "/admin/users" },
                { label: "Peran & Izin" },
            ]}
        >
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        Peran & Hak Akses (RBAC)
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Atur matriks perizinan granular untuk setiap kelompok pengguna sistem
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Roles Selector Column */}
                    <div className="md:col-span-1 space-y-2">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block px-1">
                            Pilih Peran
                        </span>
                        <div className="space-y-1">
                            {roles.map((r) => {
                                const isCurrent = selectedRole?.id === r.id;
                                return (
                                    <button
                                        key={r.id}
                                        onClick={() => handleSelectRole(r)}
                                        className={`w-full flex items-center justify-between p-3.5 rounded-xl text-left text-xs font-semibold transition-all ${
                                            isCurrent
                                                ? "bg-primary text-primary-foreground shadow-xs"
                                                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Shield className="w-4 h-4 shrink-0" />
                                            <span className="uppercase">{r.name}</span>
                                        </div>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                                            isCurrent ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                                        }`}>
                                            {r.name === "admin" ? "Semua" : `${r.permissions.length} izin`}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Permissions Matrix */}
                    <div className="md:col-span-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                            <div>
                                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                    <span>Hak Akses untuk:</span>
                                    <span className="uppercase text-primary font-mono font-bold">
                                        {selectedRole?.name}
                                    </span>
                                </h2>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    {selectedRole?.name === "admin"
                                        ? "Peran Administrator memiliki hak akses bypass penuh ke semua modul sistem."
                                        : "Tandai izin yang boleh diakses oleh pemegang peran ini."}
                                </p>
                            </div>

                            {selectedRole?.name !== "admin" && (
                                <Button
                                    size="sm"
                                    onClick={handleSave}
                                    disabled={processing}
                                    className="gap-2 shrink-0 shadow-xs"
                                >
                                    {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    <span>Simpan Perubahan</span>
                                </Button>
                            )}
                        </div>

                        {/* Permission Checkboxes Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {permissions.map((perm) => {
                                const isChecked =
                                    selectedRole?.name === "admin" || selectedPermIds.includes(perm.id);
                                const isDisabled = selectedRole?.name === "admin";

                                return (
                                    <label
                                        key={perm.id}
                                        onClick={() => !isDisabled && togglePermission(perm.id)}
                                        className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                                            isChecked
                                                ? "bg-primary/5 border-primary/30 text-slate-900 dark:text-slate-100"
                                                : "bg-slate-50/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 text-slate-500"
                                        } ${isDisabled ? "cursor-not-allowed opacity-80" : "hover:border-primary/50"}`}
                                    >
                                        <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                                            isChecked
                                                ? "bg-primary border-primary text-white"
                                                : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                                        }`}>
                                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                        </div>
                                        <div className="space-y-0.5">
                                            <div className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                                                {perm.name}
                                            </div>
                                            <div className="text-[11px] text-slate-400">
                                                Guard: {perm.guard_name}
                                            </div>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
