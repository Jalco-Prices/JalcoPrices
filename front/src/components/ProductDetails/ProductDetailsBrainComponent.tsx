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
    const { products, editProduct, deleteProduct } = useProducts()

    const product = products.find((p: AnyProductType) => p._id === id)
    const complementProducts = products.filter((p: AnyProductType) => p.nombreGenerico === product?.nombreGenerico && p._id !== id)

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
                    complementProducts={complementProducts}
                    editProduct={editProduct}
                    deleteProduct={deleteProduct}
                />
            
            :   // User View
                <ProductDetailsUserComponent
                    product={product}
                    complementProducts={complementProducts}
                />
    )
}