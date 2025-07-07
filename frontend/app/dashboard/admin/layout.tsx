"use client";
import React, { useEffect } from "react";
import Sidebar from "../../../components/layout/Sidebar";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();

  if (!user || user.role !== "ADMIN") {
    router.push("/auth/login");
  }
  return (
    <div>
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
