import React from "react";
import { TooltipProvider } from "../ui/tooltip";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <TooltipProvider>{children}</TooltipProvider>;
}
