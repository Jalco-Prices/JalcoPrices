// Components
import CatalogProductCardComponent from "../Cards/CatalogProductCardComponent"
// Types
import { AnyProductType } from "@/models/ProductModel"


export default function CatalogProductsGridComponent(
    { products }
    :
    { readonly products: AnyProductType[]}
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