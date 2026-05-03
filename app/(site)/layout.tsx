import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { cookies } from 'next/headers'
import { Navbar } from '@/components/public/Navbar'
import { Footer } from '@/components/public/Footer'
import { LanguageProvider, Language } from '@/components/public/LanguageContext'
import { ReactLenis } from "lenis/react";
import { ScrollReset } from "@/components/public/ScrollReset";
import { SessionProvider } from "@/components/providers/SessionProvider";
import prisma from "@/lib/prisma";
import { FloatingContact } from "@/components/public/FloatingContact";
import "../globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"],
});

export async function generateMetadata(): Promise<Metadata> {
  let config: Record<string, string> = {};
  try {
    const settings = await prisma.platformSetting.findMany();
    config = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
  } catch (error) {
    console.error("Erro ao carregar metadata:", error);
  }

  const title = config['META_TITLE'] || config['PLATFORM_NAME'] || "EU-Mercosur Ready";
  const description = config['META_DESCRIPTION'] || "Conectando empresas prontas para negócios internacionais.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const language = (cookieStore.get('mr-language')?.value as Language) || 'pt'
  
  let config: Record<string, string> = {};
  try {
    const settings = await prisma.platformSetting.findMany();
    config = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
  } catch (error) {
    console.error("Erro ao carregar configurações do layout:", error);
  }

  const primaryColor = config['PRIMARY_COLOR'] || '#0B1F3A';
  const secondaryColor = config['SECONDARY_COLOR'] || '#C8943A';

  return (
    <div className={`${jakarta.variable} ${inter.variable} antialiased font-body bg-[var(--background)] text-[var(--foreground)]`}>
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --color-navy: ${primaryColor};
          --color-gold: ${secondaryColor};
        }
      ` }} />
      <LanguageProvider initialLanguage={language}>
        <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
          <div className="flex flex-col min-h-screen">
            <ScrollReset />
            <Navbar />
            <div className="flex-grow">
              {children}
            </div>
            <Footer />
            <FloatingContact />
          </div>
        </ReactLenis>
      </LanguageProvider>
    </div>
  )
}
