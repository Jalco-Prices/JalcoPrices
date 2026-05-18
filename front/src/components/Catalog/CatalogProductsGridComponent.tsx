// Components
import CatalogProductCardComponent from "../Cards/CatalogProductCardComponent"
// Types
import { AnyProductType } from "@/models/ProductModel"
// Utils
import { useState } from "react"


export default function CatalogProductsGridComponent(
    { products }
    :
    { readonly products: AnyProductType[]}
) {
    const [isShowingProduct, setIsShowingProduct] = useState<boolean>(false)

    return (
        <section className="catalog-products-grid">
            {products.map((product) => (
                <CatalogProductCardComponent
                    key={product._id}
                    product={product}
                    isShowingProduct={isShowingProduct}
                    setIsShowingProduct={setIsShowingProduct}
                />
            ))}
        </section>
    )
}