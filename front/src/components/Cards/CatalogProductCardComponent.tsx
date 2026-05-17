import "@/styles/Cards/CatalogProductCardStyle.css"

// Models
import { AnyProductType } from "@/models/ProductModel"
// Context
import { useProducts } from "@/context/ProductsContext"
// Images
import ImageNotFound from "@/assets/images/ImageNotFound.png"
// Utils
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { toast } from "sonner"
import Image from "next/image"


export default function CatalogProductCardComponent(
    { product }
    :
    { readonly product: AnyProductType }
) {
    const { updateProductViews } = useProducts()
    const { getToken } = useAuth()
    const router = useRouter()

    const handleCardClick = async () => {
        toast.info("Cargando producto...", { duration: 1000 })
        router.push(`/product/${product._id}`)
        const token = await getToken()
        if (!token) {
            console.error("No se pudo obtener el token de autenticación.")
            return
        }
        updateProductViews(token, product._id!)
    }

    return (
        <button
            className="group catalog-product-card-container"
            onClick={handleCardClick}
        >
            {/* Product Image Container */}
            <div className="catalog-product-card-image-container">
                {/* Product Image */}
                <Image
                    alt={`Imagen de ${product.nombre}`}
                    src={product.imagen == "" || product.imagen == null ? ImageNotFound : product.imagen}
                    className="group-hover:scale-110 catalog-product-card-image"
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    loading="eager"
                />
                
                {/* Stock Status */}
                <div className="catalog-product-card-stock-status-container">
                    {true
                        ?   <span className="catalog-product-card-stock-status-available">Disponible</span>
                        :   <span className="catalog-product-card-stock-status-unavailable">No Disponible</span>
                    }
                </div>
            </div>

            {/* Product Info */}
            <div className="catalog-product-card-info-container">
                {/* Product Name */}
                <h3 className="catalog-product-card-info-name">{product.nombre}</h3>

                {/* Prices Container */}
                <div className="catalog-product-card-prices-container">
                    {/* Price Retail */}
                    <div className="catalog-product-card-price-wrapper">
                        <span className="catalog-product-card-price-label">May:</span>
                        <span className="catalog-product-card-price">${product.precioMayoreo}</span>
                    </div>

                    {/* Price Wholesale */}
                    <div className="catalog-product-card-price-wrapper">
                        <span className="catalog-product-card-price-label">Men:</span>
                        <span className="catalog-product-card-price">${product.precioMenudeo}</span>
                    </div>
                </div>
            </div>
        </button>
    )
}