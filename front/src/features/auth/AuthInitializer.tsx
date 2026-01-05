"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/features/auth/store/authStore";

export const AuthInitializer = () => {
  const { fetchUser } = useAuthStore();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      fetchUser();
      initialized.current = true;
    }
  }, [fetchUser]);

  return null;
};
