'use client'

// Components
import ProductFormComponent from "../Global/ProductFormComponent"
// Models
import { ProductType } from "@/models/ProductModel"
// Utils
import { useState } from "react"

const emptyProduct: ProductType = {
    _id: "",
    nombre: "",
    categoria: "",
    nombreGenerico: "",
    codigoDeBarras: "",
    imagen: "",
    precioMenudeo: 0,
    precioMayoreo: 0,
    precioTienda: 0,
    precioConIva: 0,
    precioPolitica: 0,
    minimoMayoreo: 1,
    porcentajeUtilidadReal: 0,
    proveedor: "",
    vecesVisto: 0,
    createdAt: "",
    updatedAt: "",
}

export default function CreateProductComponent() {
    const [localProduct, setLocalProduct] = useState<ProductType>(emptyProduct)
    const [isShowBarcode, setIsShowBarcode] = useState(false)

    return (
        <section className="section-container">
            {/* Section Title */}
            <h1 className="section-title-label">Crear Producto</h1>

            {/* Action Button */}

            <ProductFormComponent
                type="create"
                localProduct={localProduct}
                isShowBarcode={isShowBarcode}
                setLocalProduct={setLocalProduct}
                setIsShowBarcode={setIsShowBarcode}
            />
        </section>
    )
}