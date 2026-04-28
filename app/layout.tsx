import type { Metadata } from "next";
import { SessionProvider } from "@/components/providers/SessionProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "EU-Mercosur Ready | B2B Trade Hub",
  description: "Conectando empresas prontas para negócios internacionais entre Europa e Mercosul.",
  icons: {
    icon: "/logo-mia-navy.png",
    shortcut: "/logo-mia-navy.png",
    apple: "/logo-mia-navy.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
