import React from "react";
import RootLayout from "./RootLayout";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <RootLayout>{children}</RootLayout>;
}
