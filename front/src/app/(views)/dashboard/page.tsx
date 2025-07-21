"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSidebar } from "@/hooks/useSidebar";

export default function Dashboard() {
  const { selectedModule } = useSidebar();
  const router = useRouter();

  useEffect(() => {
    if (selectedModule?.slug) {
      router.push(`/dashboard/${selectedModule.slug}`);
    }
  }, [selectedModule]);

  return null;
}
