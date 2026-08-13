"use client";

import { useStore } from "@/lib/store";
import { X } from "lucide-react";

const colorMap: Record<string, string> = {
  info: "border-l-primary",
  success: "border-l-success",
  warning: "border-l-warning",
  error: "border-l-danger",
};

export function ToastContainer() {
  const toasts = useStore((s) => s.toasts);
  const removeToast = useStore((s) => s.removeToast);

  if (!toasts.length) return null;

  return (
    <div className="fixed top-20 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`bg-white rounded-lg shadow-lg border-l-4 ${colorMap[t.type] || "border-l-primary"} px-4 py-3 text-sm font-medium max-w-sm pointer-events-auto slide-in flex items-start gap-3`}
        >
          <span className="flex-1">{t.msg}</span>
          <button
            onClick={() => removeToast(t.id)}
            className="text-text-soft hover:text-text"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
