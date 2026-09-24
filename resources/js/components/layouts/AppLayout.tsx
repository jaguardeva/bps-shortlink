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
                    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border/50 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 data-vertical:h-4 data-vertical:self-auto"
                            />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href="/dashboard">
                                            BPS Shortlink
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    {breadcrumbs.map((item, index) => {
                                        const isLast = index === breadcrumbs.length - 1;
                                        return (
                                            <React.Fragment key={index}>
                                                <BreadcrumbSeparator className="hidden md:block" />
                                                <BreadcrumbItem>
                                                    {isLast || !item.href ? (
                                                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
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
                        {actions && <div className="flex items-center gap-2">{actions}</div>}
                    </header>
                    <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                        {children}
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </RootLayout>
    );
}
