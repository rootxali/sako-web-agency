"use client";
import { useEffect } from "react";
import { setupGlobalErrorHandler } from "@/lib/errorLogger";

export default function GlobalErrorHandler() {
  useEffect(() => {
    setupGlobalErrorHandler();
  }, []);
  return null;
}
