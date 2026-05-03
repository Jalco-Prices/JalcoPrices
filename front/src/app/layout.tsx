import "./globals.css";

// Components
import { ProductsProvider } from "@/context/ProductsContext";
import NavbarComponent from "@/components/Navbar/NavbarComponent";
// Controllers
import { getAllProducts } from "@/controllers/Global/ProductsController";
// Models
import { AnyProductType } from "@/models/ProductModel";
// Utils
import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { Geist, Geist_Mono, Inter } from "next/font/google";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { getToken } = await auth()
  const token = await getToken()

  let products: AnyProductType[] = []
  let error: string | null = null

  if (token) {
    const result = await getAllProducts(token)
    if (result.error) {
        error = result.error
    } else {
        products = result.products
    }
  }

  return (
    <html lang="es">
      <ClerkProvider>
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}>
        <ProductsProvider products={products} error={error}>
          <NavbarComponent />
          {children}
        </ProductsProvider>
      </body>
      </ClerkProvider>
    </html>
  );
}
