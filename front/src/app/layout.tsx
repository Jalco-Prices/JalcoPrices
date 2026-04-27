// Components
import NavbarComponent from "@/components/Navbar/NavbarComponent";
// Utils
import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs'
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jalco Prices",
  description: "Apllicación para gestionar los precios de los envases de Jalco",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <ClerkProvider>
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}>
        <NavbarComponent />
        {children}
      </body>
      </ClerkProvider>
    </html>
  );
}
