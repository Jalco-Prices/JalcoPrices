'use client';

// Context
import { useProducts } from "@/context/ProductsContext"


export default function CatalogComponent() {
    const { products, error } = useProducts()

    if (error) {
        return (
            <section className="section-container">
                <h1 className="section-title-label">
                    Error al cargar los productos: {error}
                </h1>
            </section>
        )
    }

    return (
        <section className="section-container">
            {/* Title */}
            <h1 className="section-title-label">
                Catálogo de Productos
            </h1>
        </section>
    )
}