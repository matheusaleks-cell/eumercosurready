import type { Metadata } from "next";
import { SessionProvider } from "@/components/providers/SessionProvider";
import "./globals.css";

import { getPublicSettings } from "@/lib/actions/settings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();
  const faviconUrl = settings['PLATFORM_FAVICON'] || "/favicon.ico";
  const version = Date.now();

  return {
    title: settings['META_TITLE'] || "EU-Mercosur Ready | B2B Trade Hub",
    description: settings['META_DESCRIPTION'] || "Conectando empresas prontas para negócios internacionais entre Europa e Mercosul.",
  };
}

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
