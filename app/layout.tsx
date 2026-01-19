import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Planner Fornecedores 2026",
  description: "Reservas de campanhas e calendário de ações para fornecedores."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="min-h-screen">
          <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Planner</p>
                <h1 className="text-xl font-semibold">Planner Fornecedores 2026</h1>
              </div>
              <nav className="flex gap-4 text-sm">
                <a className="text-blue-600 hover:text-blue-800" href="/">Visão Geral</a>
                <a className="text-blue-600 hover:text-blue-800" href="/supplier">Fornecedor</a>
                <a className="text-blue-600 hover:text-blue-800" href="/admin">Equipe</a>
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
