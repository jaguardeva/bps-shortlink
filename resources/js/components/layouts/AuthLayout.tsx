import React from "react";
import RootLayout from "./RootLayout";

interface AuthLayoutProps {
    children: React.ReactNode;
}
export default function AuthLayout({ children }: AuthLayoutProps) {
    return <RootLayout>{children}</RootLayout>;
}
