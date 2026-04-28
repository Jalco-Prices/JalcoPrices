// Components
import CatalogProductCardComponent from "../Cards/CatalogProductCardComponent"
// Types
import { AnyProductType } from "@/models/ProductModel"


export default function CatalogProductsGridComponent(
    { products, filter, order }
    :
    { readonly products: AnyProductType[], readonly filter: string | null, readonly order: string | null }
) {
    return (
        <section className="catalog-products-grid">
            {products.map((product) => (
                <CatalogProductCardComponent
                    key={product._id}
                    product={product}
                />
            ))}
        </section>
    )
}