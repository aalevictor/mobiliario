/** @format */

import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/providers/AuthProviders";
import { QueryProvider } from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import type { Metadata } from "next";
import "./globals.css";
import ObserverProvider from "@/providers/ObserverProvider";
// Removido next/font para compatibilidade com Tailwind CSS v4
// A fonte será carregada via CSS externo

export const metadata: Metadata = {
  title: "Concurso Nacional de Mobiliário Urbano para São Paulo - 2025",
  description: "Concurso Nacional de Mobiliário Urbano para São Paulo - 2025",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased font-sans">
        <AuthProvider>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              disableTransitionOnChange
            >
              <ObserverProvider>
                <a 
                  href="#top" 
                  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#A5942B] text-white px-4 py-2 rounded-md z-50"
                >
                  Voltar ao topo da página
                </a>
                {children}
                <Toaster richColors />
              </ObserverProvider>
            </ThemeProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
