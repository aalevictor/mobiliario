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
