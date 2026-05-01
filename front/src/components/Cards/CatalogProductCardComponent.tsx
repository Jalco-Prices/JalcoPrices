import "@/styles/Cards/CatalogProductCardStyle.css"

// Models
import { AnyProductType } from "@/models/ProductModel"
// Images
import ImageNotFound from "@/assets/images/ImageNotFound.png"
// Utils
import Image from "next/image"
import Link from "next/link"


export default function CatalogProductCardComponent(
    { product }
    :
    { readonly product: AnyProductType }
) {
    return (
        <Link
            className="group catalog-product-card-container"
            href={`/product/${product._id}`}
        >
            {/* Product Image Container */}
            <div className="catalog-product-card-image-container">
                {/* Product Image */}
                <Image
                    alt={`Imagen de ${product.nombre}`}
                    src={product.imagen == "" || product.imagen == null ? ImageNotFound : product.imagen}
                    className="group-hover:scale-110 catalog-product-card-image"
                    fill
                    sizes="undefined"
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
        </Link>
    )
}