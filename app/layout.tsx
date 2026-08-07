import type { Metadata } from "next";
import { Be_Vietnam_Pro, Noto_Sans } from "next/font/google";
import { SessionProvider } from "@/components/providers/SessionProvider";
import "./globals.css";

import { getPublicSettings } from "@/lib/actions/settings";

// Substitui o @import bloqueante do Google Fonts em globals.css — next/font
// self-hospeda e injeta as variáveis --font-display/--font-body sem round-trip externo.
const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();
  const faviconUrl = settings['PLATFORM_FAVICON'] || "/favicon.ico";
  return {
    title: settings['META_TITLE'] || "EU-Mercosur Ready | B2B Trade Hub",
    description: settings['META_DESCRIPTION'] || "Conectando empresas prontas para negócios internacionais entre Europa e Mercosul.",
    icons: {
      icon: faviconUrl,
    }
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${beVietnamPro.variable} ${notoSans.variable} antialiased`} suppressHydrationWarning>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
