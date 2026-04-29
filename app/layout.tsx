import type { Metadata } from "next";
import { SessionProvider } from "@/components/providers/SessionProvider";
import "./globals.css";

import { getPublicSettings } from "@/lib/actions/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();
  const favicon = settings['PLATFORM_FAVICON'] || "/favicon.jpeg";
  // Cache-busting usando timestamp para forçar atualização no navegador
  const iconUrl = `${favicon}${favicon.includes('?') ? '&' : '?'}v=${Date.now()}`;

  return {
    title: settings['META_TITLE'] || "EU-Mercosur Ready | B2B Trade Hub",
    description: settings['META_DESCRIPTION'] || "Conectando empresas prontas para negócios internacionais entre Europa e Mercosul.",
    icons: {
      icon: iconUrl,
      shortcut: iconUrl,
      apple: iconUrl,
    },
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
