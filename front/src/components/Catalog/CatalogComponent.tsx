// Models
import { AnyProductType } from "@/models/ProductModel"


export default function CatalogComponent(
    { products }
    :
    { readonly products: AnyProductType[] }
) {
    return (
        <section className="section-container">
            {/* Title */}
            <h1 className="section-title-label">
                Catálogo de Productos
            </h1>
        </section>
    )
}