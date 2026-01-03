import { AppLayout } from "@/components/AppLayout";
import React from "react";

export default function ClientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
