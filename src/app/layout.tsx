import type { Metadata } from "next";
import { Playfair_Display, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { SiteProvider } from "@/context/SiteContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-title",
});

const nunito = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Espace Hambol - Restaurant, Hébergement, Loisirs",
  description: "Découvrez l'élégance et l'authenticité de l'Espace Hambol. Restaurant raffiné, hébergement de luxe et activités de loisirs au cœur d'un cadre enchanteur.",
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${playfair.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">
        <SiteProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <WhatsAppFloat />
          </AuthProvider>
        </SiteProvider>
      </body>
    </html>
  );
}
