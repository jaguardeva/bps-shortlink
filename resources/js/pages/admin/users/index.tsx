import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AppLayout from "@/components/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Users,
    UserPlus,
    Search,
    Shield,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    Power,
    BarChart3,
    KeyRound,
} from "lucide-react";
import { User, Role } from "@/types/auth";
import { PaginatedResponse } from "@/types/shortlink";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface UserIndexProps {
    users: PaginatedResponse<User>;
    roles: Role[];
    filters: {
        search?: string;
        role?: string;
        status?: string;
    };
}

export default function UserIndex({ users, roles, filters }: UserIndexProps) {
    const [search, setSearch] = useState(filters.search || "");
    const [role, setRole] = useState(filters.role || "");
    const [status, setStatus] = useState(filters.status || "");

    // Reset password dialog state
    const [resetDialogOpen, setResetDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [resetError, setResetError] = useState("");

    const applyFilters = (newSearch?: string, newRole?: string, newStatus?: string) => {
        router.get(
            "/admin/users",
            {
                search: newSearch !== undefined ? newSearch : search,
                role: newRole !== undefined ? newRole : role,
                status: newStatus !== undefined ? newStatus : status,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters(search, role, status);
    };

    const handleToggle = (user: User) => {
        if (confirm(`Yakin ingin mengubah status akun ${user.name}?`)) {
            router.patch(`/admin/users/${user.id}/toggle`, {}, { preserveScroll: true });
        }
    };

    const handleDelete = (user: User) => {
        if (confirm(`Yakin ingin menghapus pengguna ${user.name}? Tautan milik pengguna ini tetap ada.`)) {
            router.delete(`/admin/users/${user.id}`, { preserveScroll: true });
        }
    };

    const handleOpenResetDialog = (user: User) => {
        setSelectedUser(user);
        setNewPassword("");
        setConfirmPassword("");
        setResetError("");
        setResetDialogOpen(true);
    };

    const handleResetSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword.length < 8) {
            setResetError("Kata sandi minimal 8 karakter.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setResetError("Konfirmasi kata sandi tidak cocok.");
            return;
        }

        if (selectedUser) {
            router.post(
                `/admin/users/${selectedUser.id}/reset-password`,
                { password: newPassword, password_confirmation: confirmPassword },
                {
                    preserveScroll: true,
                    onSuccess: () => setResetDialogOpen(false),
                    onError: (errors) => setResetError(errors.password || "Gagal mengubah kata sandi."),
                }
            );
        }
    };

    const renderStatusBadge = (statusVal: string) => {
        switch (statusVal) {
            case "active":
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Aktif</span>
                    </span>
                );
            case "inactive":
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 border border-slate-200 dark:border-slate-700">
                        <XCircle className="w-3 h-3" />
                        <span>Nonaktif</span>
                    </span>
                );
            case "suspended":
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-600 border border-rose-200 dark:border-rose-800">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Ditangguhkan</span>
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <AppLayout
            title="Kelola Pengguna"
            breadcrumbs={[
                { label: "Dashboard", href: "/dashboard" },
                { label: "Pengguna" },
            ]}
            actions={
                <Button asChild size="sm" className="gap-2">
                    <Link href="/admin/users/create">
                        <UserPlus className="w-4 h-4" />
                        <span>Tambah Pengguna</span>
                    </Link>
                </Button>
            }
        >
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            Kelola Pengguna
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Manajemen akun aparatur BPS dan penugasan peran akses
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center gap-3">
                    <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <Input
                            placeholder="Cari berdasarkan nama atau email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9.5 text-xs bg-slate-50 dark:bg-slate-800/50"
                        />
                    </form>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <select
                            value={role}
                            onChange={(e) => {
                                setRole(e.target.value);
                                applyFilters(search, e.target.value, status);
                            }}
                            className="h-9 px-3 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-primary/20 text-slate-700 dark:text-slate-300"
                        >
                            <option value="">Semua Peran</option>
                            {roles.map((r) => (
                                <option key={r.id} value={r.name}>
                                    {r.name.toUpperCase()}
                                </option>
                            ))}
                        </select>

                        <select
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value);
                                applyFilters(search, role, e.target.value);
                            }}
                            className="h-9 px-3 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-primary/20 text-slate-700 dark:text-slate-300"
                        >
                            <option value="">Semua Status</option>
                            <option value="active">Aktif</option>
                            <option value="inactive">Nonaktif</option>
                            <option value="suspended">Ditangguhkan</option>
                        </select>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50/75 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase">
                                <tr>
                                    <th className="py-3.5 px-4">Pengguna</th>
                                    <th className="py-3.5 px-4">Peran (Role)</th>
                                    <th className="py-3.5 px-4">Status</th>
                                    <th className="py-3.5 px-4 text-center">Tautan Dibuat</th>
                                    <th className="py-3.5 px-4">Login Terakhir</th>
                                    <th className="py-3.5 px-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {users.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-slate-400 text-sm">
                                            Tidak ditemukan pengguna yang sesuai.
                                        </td>
                                    </tr>
                                ) : (
                                    users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="py-3.5 px-4">
                                                <div className="font-semibold text-slate-900 dark:text-slate-100">
                                                    {user.name}
                                                </div>
                                                <div className="text-slate-400 text-[11px]">{user.email}</div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles?.map((r) => (
                                                        <span
                                                            key={r.id}
                                                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[10px] font-semibold uppercase ${
                                                                r.name === "admin"
                                                                    ? "bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400 border border-purple-200 dark:border-purple-800"
                                                                    : "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                                                            }`}
                                                        >
                                                            <Shield className="w-2.5 h-2.5" />
                                                            {r.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4">{renderStatusBadge(user.status)}</td>
                                            <td className="py-3.5 px-4 text-center font-semibold text-slate-700 dark:text-slate-300">
                                                {user.shortlinks_count || 0}
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                                                {user.last_login_at
                                                    ? new Date(user.last_login_at).toLocaleString("id-ID", {
                                                          dateStyle: "medium",
                                                          timeStyle: "short",
                                                      })
                                                    : "Belum pernah"}
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        render={(props) => (
                                                            <Button variant="ghost" size="icon" className="h-8 w-8" {...props}>
                                                                <MoreHorizontal className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                    />
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuGroup>
                                                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                            <DropdownMenuItem
                                                                className="gap-2 cursor-pointer"
                                                                onClick={() => router.visit(`/admin/users/${user.id}`)}
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                                <span>Lihat Profil</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="gap-2 cursor-pointer"
                                                                onClick={() => router.visit(`/admin/users/${user.id}/edit`)}
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                                <span>Edit Data</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="gap-2 cursor-pointer"
                                                                onClick={() => router.visit(`/admin/analytics/users/${user.id}`)}
                                                            >
                                                                <BarChart3 className="w-4 h-4" />
                                                                <span>Lihat Statistik</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleOpenResetDialog(user)}
                                                                className="gap-2 cursor-pointer"
                                                            >
                                                                <KeyRound className="w-4 h-4" />
                                                                <span>Reset Kata Sandi</span>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuGroup>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuGroup>
                                                            <DropdownMenuItem
                                                                onClick={() => handleToggle(user)}
                                                                className="gap-2 cursor-pointer"
                                                            >
                                                                <Power className="w-4 h-4" />
                                                                <span>{user.status === "active" ? "Nonaktifkan Akun" : "Aktifkan Akun"}</span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleDelete(user)}
                                                                className="gap-2 text-rose-600 focus:text-rose-600 cursor-pointer"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                                <span>Hapus Pengguna</span>
                                                            </DropdownMenuItem>
                                                        </DropdownMenuGroup>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.links && users.links.length > 3 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                            <span className="text-slate-500">
                                Menampilkan {users.from || 0} - {users.to || 0} dari {users.total} pengguna
                            </span>
                            <div className="flex gap-1">
                                {users.links.map((link, idx) => (
                                    <Button
                                        key={idx}
                                        asChild={Boolean(link.url)}
                                        disabled={!link.url}
                                        variant={link.active ? "default" : "outline"}
                                        size="sm"
                                        className="h-8 px-3 text-xs"
                                    >
                                        {link.url ? (
                                            <Link
                                                href={link.url}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                        )}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Reset Password Dialog */}
            <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reset Kata Sandi Pengguna</DialogTitle>
                        <DialogDescription>
                            Masukkan kata sandi baru untuk {selectedUser?.name} ({selectedUser?.email}).
                        </DialogDescription>
                    </DialogHeader>

                    {resetError && (
                        <div className="p-3 rounded-lg bg-rose-50 text-rose-600 text-xs border border-rose-200">
                            {resetError}
                        </div>
                    )}

                    <form onSubmit={handleResetSubmit} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Kata Sandi Baru
                            </label>
                            <Input
                                type="password"
                                placeholder="Minimal 8 karakter"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Ulangi Kata Sandi
                            </label>
                            <Input
                                type="password"
                                placeholder="Ketik ulang kata sandi baru"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => setResetDialogOpen(false)}>
                                Batal
                            </Button>
                            <Button type="submit">
                                Simpan Kata Sandi
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
