import * as React from "react"
import { Link, usePage } from "@inertiajs/react"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Link2,
  PlusCircle,
  BarChart3,
  Users,
  Activity,
  ShieldAlert,
  FileText,
  Settings,
} from "lucide-react"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { auth } = usePage().props as any
  const user = auth?.user
  const isAdmin = Boolean(user?.is_admin || user?.roles?.includes("admin"))
  const currentPath = typeof window !== "undefined" ? window.location.pathname : ""

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-border/50 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/dashboard" />} className="hover:bg-transparent">
              <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
                <Link2 className="size-5" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  BPS Mojokerto
                </span>
                <span className="truncate text-xs font-mono text-primary font-medium">
                  link.kanal3516.site
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Utama */}
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href="/dashboard" />}
                isActive={currentPath === "/dashboard"}
                tooltip="Dashboard"
              >
                <LayoutDashboard className="size-4" />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href="/shortlinks" />}
                isActive={currentPath === "/shortlinks"}
                tooltip="Semua Tautan"
              >
                <Link2 className="size-4" />
                <span>{isAdmin ? "Semua Tautan" : "Tautan Saya"}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href="/shortlinks/create" />}
                isActive={currentPath === "/shortlinks/create"}
                tooltip="Buat Tautan"
              >
                <PlusCircle className="size-4" />
                <span>Buat Tautan Baru</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href="/analytics" />}
                isActive={currentPath.startsWith("/analytics")}
                tooltip="Statistik & Analisis"
              >
                <BarChart3 className="size-4" />
                <span>Statistik & Analisis</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Administrasi - Only visible to Admin */}
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Administrasi & Kontrol</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href="/admin/users" />}
                  isActive={currentPath.startsWith("/admin/users")}
                  tooltip="Kelola Pengguna"
                >
                  <Users className="size-4" />
                  <span>Kelola Pengguna</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href="/admin/monitoring/activity" />}
                  isActive={currentPath === "/admin/monitoring/activity"}
                  tooltip="Aktivitas Sistem"
                >
                  <Activity className="size-4" />
                  <span>Aktivitas Sistem</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href="/admin/monitoring/failed-access" />}
                  isActive={currentPath === "/admin/monitoring/failed-access"}
                  tooltip="Percobaan Akses Gagal"
                >
                  <ShieldAlert className="size-4" />
                  <span>Akses Gagal</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href="/admin/audit-logs" />}
                  isActive={currentPath === "/admin/audit-logs"}
                  tooltip="Log Audit"
                >
                  <FileText className="size-4" />
                  <span>Log Audit</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href="/admin/settings" />}
                  isActive={currentPath === "/admin/settings"}
                  tooltip="Pengaturan Sistem"
                >
                  <Settings className="size-4" />
                  <span>Pengaturan Sistem</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50">
        {user && <NavUser user={user} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
