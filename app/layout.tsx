/** @format */

import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/providers/AuthProviders";
import { QueryProvider } from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import type { Metadata } from "next";
import "./globals.css";
import ObserverProvider from "@/providers/ObserverProvider";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-manrope",
});

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
    <html lang="pt-BR" suppressHydrationWarning className={manrope.variable}>
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
