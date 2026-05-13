'use client'

// Components
import ErrorComponent from "@/components/Global/ErrorComponent"
import ProductFormComponent from "../Global/ProductFormComponent"
import SecondaryActionButtonComponent from "../Buttons/SecondaryActionButtonComponent"
// Models
import { ProductType } from "@/models/ProductModel"
// Contexts
import { useUser } from "@/context/UserContext"
import { useProducts } from "@/context/ProductsContext"
// Utils
import { useAuth } from "@clerk/nextjs"
import { useState, useEffect } from "react"
import { toast } from 'sonner'

const emptyProduct: ProductType = {
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
}

export default function CreateProductComponent() {
    const { isAdmin } = useUser()
    const { addProduct } = useProducts()
    const { getToken } = useAuth()

    const [localProduct, setLocalProduct] = useState<ProductType>(emptyProduct)
    const [isShowBarcode, setIsShowBarcode] = useState(false)
    const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(true)

    // Function to handle product Addition
    const handleAddProduct = async () => {
        setIsAddButtonDisabled(true)
        const toastId = toast.loading("Agregando producto...")

        const token = await getToken()
        if (!token) {
            setIsAddButtonDisabled(false)
            toast.error("No se pudo obtener el token de autenticación", { id: toastId })
            return
        }

        const result = await addProduct(token, localProduct)
        if (!result.success) {
            setIsAddButtonDisabled(false)
            toast.error(result.error || "Error al agregar el producto", { id: toastId })
            return
        }
        
        setLocalProduct(emptyProduct)
        toast.success("Producto agregado", { id: toastId })
    }

    // Check if add button should be enabled/disabled
    useEffect(() => {
        if (localProduct.nombre.trim() == "" || localProduct.categoria.trim() == "" || localProduct.nombreGenerico.trim() == "") {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsAddButtonDisabled(true)
            return
        }

        setIsAddButtonDisabled(false)
    }, [localProduct])

    // No admin access State
    if (!isAdmin) {
        return (
            <ErrorComponent message="No tienes permiso para acceder a esta página" />
        )
    }

    return (
        <section className="section-container">
            {/* Section Title */}
            <h1 className="section-title-label">Crear Producto</h1>

            {/* Action Button */}
            <div className="flex justify-end">
                <SecondaryActionButtonComponent
                    idName="add-button"
                    label="Agregar"
                    isDisabled={isAddButtonDisabled}
                    handleClick={handleAddProduct}
                />
            </div>

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