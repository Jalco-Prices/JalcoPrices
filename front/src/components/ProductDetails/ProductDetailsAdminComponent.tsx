/* eslint-disable react-hooks/set-state-in-effect */
'use client'

// Components
import ReturnButtonComponent from "../Buttons/ReturnButtonComponent"
import ProductFormComponent from "../Global/ProductFormComponent"
import SecondaryActionButtonComponent from "../Buttons/SecondaryActionButtonComponent"
// Models
import { ProductType } from "@/models/ProductModel"
// Utils
import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { toast } from 'sonner'


export default function ProductDetailsAdminComponent(
    { product, editProduct, deleteProduct }
    :
    { readonly product: ProductType, readonly editProduct: (token: string, updatedData: ProductType) => Promise<{ success: boolean, error: string | null }>, readonly deleteProduct: (token: string, id: string) => Promise<{ success: boolean, error: string | null }> }
) {
    const { getToken } = useAuth()
    const router = useRouter()

    const [localProduct, setLocalProduct] = useState<ProductType>({ ...product })
    const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] = useState(false)
    const [isUpdateButtonDisabled, setIsUpdateButtonDisabled] = useState(true)
    const [isShowBarcode, setIsShowBarcode] = useState(false)

    // Function to delete product
    const handleDeleteProduct = async () => {
        setIsDeleteButtonDisabled(true)
        const toastId = toast.loading("Eliminando producto...")

        const token = await getToken()
        if (!token) {
            setIsDeleteButtonDisabled(false)
            toast.error("No se pudo obtener el token de autenticación", { id: toastId })
            return
        }

        if (!product._id) {
            setIsDeleteButtonDisabled(false)
            toast.error("ID del producto no encontrado", { id: toastId })
            return
        }

        const result = await deleteProduct(token, product._id)
        if (!result.success) {
            setIsDeleteButtonDisabled(false)
            toast.error(result.error || "Error al eliminar el producto", { id: toastId })
            return
        }

        toast.success("Producto eliminado correctamente", { id: toastId })
        setIsDeleteButtonDisabled(false)

        if (globalThis.history.length > 1) {
            router.back()
        } else {
            router.push("/")
        }
    }

    // Function to update product
    const handleUpdateProduct = async () => {
        setIsUpdateButtonDisabled(true)
        const toastId = toast.loading("Actualizando producto...")

        const token = await getToken()
        if (!token) {
            setIsUpdateButtonDisabled(false)
            toast.error("No se pudo obtener el token de autenticación", { id: toastId })
            return
        }

        const currentDate = new Date().toISOString()

        const updatedProductData: ProductType = {
            ...localProduct,
            updatedAt: currentDate,
        }

        const result = await editProduct(token, updatedProductData)
        if (!result.success) {
            setIsUpdateButtonDisabled(false)
            toast.error(result.error || "Error al actualizar el producto", { id: toastId })
            return
        }
        
        setLocalProduct(updatedProductData)
        toast.success("Producto actualizado correctamente", { id: toastId })
    }
    
    // Memoized value to check if there are changes between localProduct and the original product
    const hasChanges = useMemo(() => {
        const textFields: (keyof ProductType)[] = [
            'nombre', 'categoria', 'nombreGenerico', 'codigoDeBarras', 'proveedor'
        ]
        const numberFields: (keyof ProductType)[] = [
            'precioMenudeo', 'precioMayoreo', 'precioTienda',
            'precioConIva', 'precioPolitica', 'minimoMayoreo',
            'porcentajeUtilidadReal'
        ]

        const textChanged = textFields.some(field => localProduct[field] !== product[field])
        const numberChanged = numberFields.some(field => Number(localProduct[field]) !== Number(product[field]))

        return textChanged || numberChanged
    }, [localProduct, product])

    // Check for changes to enable/disable the update button
    useEffect(() => {
        setIsUpdateButtonDisabled(!hasChanges)
    }, [hasChanges])

    // Check if wholesale price is lower than store price for Warning
    useEffect(() => {
        if (localProduct.precioMayoreo && localProduct.precioTienda) {
            const wholesalePrice = Number(localProduct.precioMayoreo)
            const storePrice = Number(localProduct.precioTienda)
            if (wholesalePrice < storePrice) {
                toast.warning("Mayoreo es menor que el precio de tienda. Verifica los precios ingresados.")
            }
        }
    }, [localProduct.precioMayoreo, localProduct.precioTienda])

    return (
        <section className="section-container">
            {/* Top Buttons */}
            <div className="flex justify-between">
                <ReturnButtonComponent />
                <div className="flex max-[30rem]:flex-col gap-6">
                    <button
                        disabled={isDeleteButtonDisabled}
                        className="px-lg py-sm shadow-sm border rounded-lg font-inter cursor-pointer transition-all active:scale-95 text-error border-error hover:bg-error-container disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 disabled:text-white disabled:border-primary disabled:bg-primary"
                        onClick={handleDeleteProduct}
                    >
                        Eliminar
                    </button>
                    <SecondaryActionButtonComponent
                        idName="update-button"
                        label="Actualizar"
                        isDisabled={isUpdateButtonDisabled}
                        handleClick={handleUpdateProduct}
                    />
                </div>
            </div>

            {/* Product Name */}
            <h1 className="text-h2 font-inter text-primary">{localProduct.nombre}</h1>

            {/* Product Form */}
            <ProductFormComponent
                type="details"
                product={product}
                localProduct={localProduct}
                isShowBarcode={isShowBarcode}
                setLocalProduct={setLocalProduct}
                setIsShowBarcode={setIsShowBarcode}
            />
        </section>
    )
}