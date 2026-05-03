// Components
import ProductDetailsBrainComponent from "@/components/ProductDetails/ProductDetailsBrainComponent";


export default async function ProductDetailsPage(
    { params }
    :
    { readonly params: Promise<{ id: string }> }
) {
    const { id } = await params;

    return (
        <main className="main-container">
            <ProductDetailsBrainComponent
                id={id}
            />
        </main>
    )
}