// Components
import CatalogComponent from "@/components/Catalog/CatalogComponent";
// Controllers
import { getAllProducts } from "@/controllers/Pages/CatalogPageController";
// Utils
import { auth } from '@clerk/nextjs/server'


export default async function CatalogPage() {
  const { getToken } = await auth()
  const token = await getToken()

  const { products, error } = await getAllProducts(token!)

  if (error) {
    return <main className="main-container">Error: {error}</main>
  }

  return (
    <main className="main-container">
      <CatalogComponent
        products={products}
      />
    </main>
  );
}
