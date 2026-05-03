'use client';

// Components
import ProductDetailsUserComponent from "./ProductDetailsUserComponent";
import ProductDetailsAdminComponent from "./ProductDetailsAdminComponent";
// Models
import { AnyProductType, isAdminProduct } from "@/models/ProductModel"
// Utils
import { useProducts } from "@/context/ProductsContext"


export default function ProductDetailsBrainComponent(
    { id }
    :
    { readonly id: string }
) {
    const { products } = useProducts()

    const product = products.find((p: AnyProductType) => p._id === id)

    if (!product) {
        return (
            <section className="section-container">
                <h1>Producto no encontrado</h1>
            </section>
        )
    }

    return (
        isAdminProduct(product)
            ?   //Admin View
                <ProductDetailsAdminComponent
                    product={product}
                />
            
            :   // User View
                <ProductDetailsUserComponent
                    product={product}
                />
    )
}