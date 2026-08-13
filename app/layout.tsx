import type { Metadata } from "next";
import "./globals.css";
import { Topbar } from "@/components/topbar";
import { SandboxPanel } from "@/components/sandbox-panel";
import { ToastContainer } from "@/components/toast";

export const metadata: Metadata = {
  title: "POS — Abarrotes Don Eduardo",
  description: "Sandbox de Punto de Venta estilo tienda de abarrotes",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className="flex flex-col h-screen overflow-hidden">
        <Topbar />
        <SandboxPanel />
        <main className="flex-1 overflow-hidden flex flex-col">
          {children}
        </main>
        <ToastContainer />
      </body>
    </html>
  );
}
