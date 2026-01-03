import { AppLayout } from "@/components/AppLayout";
import React from "react";

export default function ProtectedRoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
