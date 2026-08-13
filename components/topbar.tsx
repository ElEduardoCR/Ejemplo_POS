"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Clock, Gamepad2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { fmtFecha } from "@/lib/utils";

const navItems = [
  { href: "/", label: "POS" },
  { href: "/inventario", label: "Inventario" },
  { href: "/backoffice", label: "Back Office" },
  { href: "/compras", label: "Compras" },
  { href: "/corte", label: "Corte" },
];

export function Topbar() {
  const pathname = usePathname();
  const sandbox = useStore((s) => s.sandbox);
  const [mounted, setMounted] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "F2") setPanelOpen((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="bg-topbar text-white h-14 px-5 flex items-center justify-between shrink-0 z-40">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold">
          <span>🛒</span>
          <span className="text-primary">Abarrotes</span>
        </Link>
        <nav className="flex gap-1">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                  active
                    ? "bg-primary text-topbar"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg text-sm"
          title="Reloj del sandbox (no es la hora real)"
        >
          <Clock className="w-4 h-4" />
          <span className="text-gray-300">
            {mounted ? fmtFecha(sandbox.fecha_actual) : "—"}
          </span>
          <span className="font-semibold tabular-nums">
            {mounted ? sandbox.hora_actual : "--:--"}
          </span>
        </div>
        <button
          onClick={() => setPanelOpen((v) => !v)}
          className="w-9 h-9 rounded-lg bg-white/10 hover:bg-primary hover:text-topbar flex items-center justify-center transition"
          title="Panel del sandbox (F2)"
        >
          <Gamepad2 className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
