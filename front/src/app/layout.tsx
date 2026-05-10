import "./globals.css";

// Components
import NavbarComponent from "@/components/Navbar/NavbarComponent";
import ErrorComponent from "@/components/Global/ErrorComponent";
// Controllers
import { getUserIsAdminController } from "@/controllers/Global/UserController"
import { getAllProductsController } from "@/controllers/Global/ProductsController";
// Models
import { AnyProductType } from "@/models/ProductModel";
// Contexts
import { UserProvider } from "@/context/UserContext";
import { ProductsProvider } from "@/context/ProductsContext";
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
  // ------  Data Fetching Start  ------
  let isAdmin: boolean = false
  let products: AnyProductType[] = []
  let error: string | null = null

  const { getToken } = await auth()
  const token = await getToken()

  if (token) {
    const userResult = await getUserIsAdminController(token)
    if (userResult.error) {
        error = userResult.error
    } else {
      isAdmin = userResult.isAdmin
    }

    const productsResult = await getAllProductsController(token)
    if (productsResult.error) {
        error = productsResult.error
    } else {
        products = productsResult.products
    }
  }
  // ------  Data Fetching End  ------

  return (
    <html lang="es">
      <ClerkProvider>
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}>
        <UserProvider isAdmin={isAdmin}>
        <ProductsProvider products={products}>
          <NavbarComponent />
          <Toaster richColors position="top-center" offset={{ top: 80 }} />
          {error
            ? // Error State
              <main className="main-container">
                <ErrorComponent message={error} />
              </main>
            : // Normal State
              children
          }
        </ProductsProvider>
        </UserProvider>
      </body>
      </ClerkProvider>
    </html>
  );
}
