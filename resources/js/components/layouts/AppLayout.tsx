import * as React from "react";
import { Head, Link } from "@inertiajs/react";
import { AppSidebar } from "@/components/app-sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import RootLayout from "./RootLayout";

export interface BreadcrumbItemType {
    label: string;
    href?: string;
}

interface AppLayoutProps {
    title: string;
    breadcrumbs?: BreadcrumbItemType[];
    actions?: React.ReactNode;
    children: React.ReactNode;
}

export default function AppLayout({
    title,
    breadcrumbs = [],
    actions,
    children,
}: AppLayoutProps) {
    return (
        <RootLayout>
            <Head title={`${title} - BPS Mojokerto Shortlink`} />
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border/50 px-3 sm:px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 min-w-0">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                            <SidebarTrigger className="-ml-1 shrink-0" />
                            <Separator
                                orientation="vertical"
                                className="mr-1 sm:mr-2 data-vertical:h-4 data-vertical:self-auto shrink-0"
                            />
                            <Breadcrumb className="min-w-0">
                                <BreadcrumbList className="flex-nowrap overflow-hidden">
                                    <BreadcrumbItem className="hidden md:block shrink-0">
                                        <BreadcrumbLink href="/dashboard">
                                            BPS Shortlink
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    {breadcrumbs.map((item, index) => {
                                        const isLast = index === breadcrumbs.length - 1;
                                        return (
                                            <React.Fragment key={index}>
                                                <BreadcrumbSeparator className="hidden md:block shrink-0" />
                                                <BreadcrumbItem className={isLast ? "truncate min-w-0" : "shrink-0 hidden sm:block"}>
                                                    {isLast || !item.href ? (
                                                        <BreadcrumbPage className="truncate max-w-[130px] sm:max-w-[220px] md:max-w-none">
                                                            {item.label}
                                                        </BreadcrumbPage>
                                                    ) : (
                                                        <BreadcrumbLink href={item.href}>
                                                            {item.label}
                                                        </BreadcrumbLink>
                                                    )}
                                                </BreadcrumbItem>
                                            </React.Fragment>
                                        );
                                    })}
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
                    </header>
                    <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </RootLayout>
    );
}
