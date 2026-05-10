import "./globals.css";

// Components
import { ProductsProvider } from "@/context/ProductsContext";
import NavbarComponent from "@/components/Navbar/NavbarComponent";
import ErrorComponent from "@/components/Global/ErrorComponent";
// Controllers
import { getAllProductsController } from "@/controllers/Global/ProductsController";
// Models
import { AnyProductType } from "@/models/ProductModel";
// Utils
import { Toaster } from 'sonner'
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
  let products: AnyProductType[] = []
  let error: string | null = null

  const { getToken } = await auth()
  const token = await getToken()

  if (token) {
    const result = await getAllProductsController(token)
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
        <ProductsProvider products={products}>
          <NavbarComponent />
          <Toaster richColors position="top-center" offset={{ top: 80 }} />
          {error
            ? // Error State
              <ErrorComponent message={error} />
            : // Normal State
              children
          }
        </ProductsProvider>
      </body>
      </ClerkProvider>
    </html>
  );
}
