/* eslint-disable react-hooks/set-state-in-effect */
'use client'

// Components
import ReturnButtonComponent from "../Buttons/ReturnButtonComponent"
import ProductDetailsInput from "../Inputs/ProductDetailsInput"
// Models
import { ProductType } from "@/models/ProductModel"
// Icons
import { BarcodeIcon, InfoCircleIcon, CashIcon } from "@/icons/Icons"
// Images
import ImageNotFound from "@/assets/images/ImageNotFound.png"
// Utils

import Image from "next/image"
import { toast } from 'sonner'
import { useAuth } from "@clerk/nextjs"
import { useState, useEffect, useMemo } from "react"


function formatCreatedAt(date: string): string {
    const dateObj = new Date(date)
    return dateObj.toLocaleDateString("es-MX", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })
}

function formatUpdatedAt(date: string): string {
    const dateObj = new Date(date)
    const now = new Date()
    const diffMs = now.getTime() - dateObj.getTime()
    const diffSeconds = Math.floor(diffMs / 1000)
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

    if (diffSeconds < 1)   return "Ahora"
    if (diffSeconds < 60)  return `Hace ${diffSeconds} ${diffSeconds == 1 ? "segundo" : "segundos"}`
    if (diffMinutes < 60)  return `Hace ${diffMinutes} ${diffMinutes == 1 ? "minuto" : "minutos"}`
    if (diffHours < 24)    return `Hace ${diffHours} ${diffHours == 1 ? "hora" : "horas"}`

    return dateObj.toLocaleDateString("es-MX", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })
}

export default function ProductDetailsAdminComponent(
    { product, editProduct }
    :
    { readonly product: ProductType, readonly editProduct: (token: string, updatedData: ProductType) => Promise<{ success: boolean, error: string | null }> }
) {
    const { getToken } = useAuth()

    const [localProduct, setLocalProduct] = useState<ProductType>({ ...product })
    const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] = useState(false)
    const [isUpdateButtonDisabled, setIsUpdateButtonDisabled] = useState(true)
    const [isMounted, setIsMounted] = useState(false)

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

        const updatedProductData: ProductType = {
            ...localProduct,
            updatedAt: new Date().toISOString(),
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

    // Function to modify Product Profit Margin
    const modifyProductProfitMargin = (wholesalePrice: number, priceWithVat: number) => {
        const productProfitMarginField = 'porcentajeUtilidadReal' as keyof ProductType
        let productProfitMarginValue = 0
        if (wholesalePrice > 0 && priceWithVat > 0) {
            const tempStringValue = ((wholesalePrice / priceWithVat) * 100).toFixed(2)
            productProfitMarginValue = Number(tempStringValue)
        }
        setLocalProduct(prev => ({ ...prev, [productProfitMarginField]: productProfitMarginValue }))
    }

    // Input change handler
    const setField = <K extends keyof ProductType>(field: K, value: ProductType[K]) => {
        setLocalProduct(prev => ({ ...prev, [field]: value }))

        if (field === 'precioMayoreo') {
            // Retail Price Modification
            const retailPriceField = 'precioMenudeo' as keyof ProductType
            const retailPriceValue = (value as number * 2).toFixed(2)
            setLocalProduct(prev => ({ ...prev, [retailPriceField]: retailPriceValue }))
            // Product Profit Margin Modification
            modifyProductProfitMargin(value as number, localProduct.precioConIva)
        }

        if (field === 'precioMenudeo') {
            // Wholesale Price Modification
            const wholesalePriceField = 'precioMayoreo' as keyof ProductType
            const wholesalePriceValue = (value as number / 2).toFixed(2)
            setLocalProduct(prev => ({ ...prev, [wholesalePriceField]: wholesalePriceValue }))
        }

        if (field === 'precioTienda') {
            // Price with VAT Modification
            const priceWithVatField = 'precioConIva' as keyof ProductType
            const priceWithVatValue = ((value as number) * 1.16).toFixed(2)
            setLocalProduct(prev => ({ ...prev, [priceWithVatField]: priceWithVatValue }))
            // Policy Price Modification
            const productPolicyPriceField = 'precioPolitica' as keyof ProductType
            const productPolicyPriceValue = (Number(priceWithVatValue) * 1.4).toFixed(2)
            setLocalProduct(prev => ({ ...prev, [productPolicyPriceField]: productPolicyPriceValue }))
            // Product Profit Margin Modification
            modifyProductProfitMargin(localProduct.precioMayoreo, Number(priceWithVatValue))
        }
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

    // Set isMounted
    useEffect(() => { setIsMounted(true) }, [])

    return (
        <section className="section-container">
            {/* Top Buttons */}
            <div className="flex justify-between">
                <ReturnButtonComponent />
                <div className="flex max-[30rem]:flex-col gap-6">
                    <button
                        disabled={isDeleteButtonDisabled}
                        className="px-lg py-sm shadow-sm border rounded-lg font-inter cursor-pointer transition-all active:scale-95 text-error border-error hover:bg-error-container disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 disabled:text-white disabled:border-primary disabled:bg-primary"
                    >
                        Eliminar
                    </button>
                    <button
                        id="update-button"
                        disabled={isUpdateButtonDisabled}
                        className="px-lg py-sm shadow-sm border rounded-lg font-inter cursor-pointer transition-all active:scale-95 text-secondary border-secondary bg-white hover:bg-primary-fixed disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 disabled:text-white disabled:border-primary disabled:bg-primary"
                        onClick={handleUpdateProduct}
                    >
                        Actualizar
                    </button>
                </div>
            </div>

            {/* Product Name */}
            <h1 className="text-h2 font-inter text-primary">{localProduct.nombre}</h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
                {/* Left Column */}
                <div className="lg:col-span-4 space-y-lg">
                    <div className="overflow-hidden p-lg rounded-xl border shadow-sm border-outline-variant bg-surface-container-lowest">
                        <div className="relative overflow-hidden aspect-square rounded-lg bg-surface-container mb-md">
                            <Image
                                src={localProduct.imagen == "" || localProduct.imagen == null ? ImageNotFound : localProduct.imagen}
                                alt={`${localProduct.nombre} Image`}
                                fill
                                className="object-cover"
                                sizes="undefined"
                                loading="eager"
                            />
                        </div>
                        <button className="w-full py-sm flex items-center justify-center gap-2 border rounded-lg transition-all hover:cursor-pointer active:scale-95 text-primary border-outline-variant/20 bg-surface-container hover:bg-surface-container-high">
                            <div className="h-5">
                                <BarcodeIcon size="fill" />
                            </div>
                            Código de Barras
                        </button>
                    </div>

                    {/* Product Metadata */}
                    <div className="bg-surface-container-low p-lg rounded-xl border border-outline-variant">
                        <h3 className="font-label-caps text-label-caps text-on-primary-container mb-md">Metadatos</h3>
                        <div className="space-y-sm">
                            <div className="flex justify-between items-center py-sm font-inter border-b border-outline-variant/30">
                                <span className="text-on-surface-variant">Creado</span>
                                <span className="text-on-surface">{formatCreatedAt(localProduct.createdAt)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-sm font-inter">
                                <span className="text-on-surface-variant">Modificado</span>
                                <span className="text-on-surface">
                                    {isMounted ? formatUpdatedAt(localProduct.updatedAt) : formatUpdatedAt(product.updatedAt)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-8 space-y-lg">
                    <section className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm">
                        <div className="flex items-center gap-sm mb-lg">
                            <div className="h-6">
                                <InfoCircleIcon size="fill" color="#0058be" />
                            </div>
                            <h2 className="font-inter text-h3 text-primary">Identidad</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                            <ProductDetailsInput
                                id="product-name"
                                label="Nombre"
                                value={localProduct.nombre}
                                setValue={(v) => setField('nombre', v as string)}
                            />
                            <ProductDetailsInput
                                id="product-category"
                                label="Categoría"
                                value={localProduct.categoria}
                                setValue={(v) => setField('categoria', v as string)}
                            />
                            <ProductDetailsInput
                                id="product-generic-name"
                                label="Rosca"
                                value={localProduct.nombreGenerico}
                                setValue={(v) => setField('nombreGenerico', v as string)}
                            />
                            <ProductDetailsInput
                                id="product-barcode"
                                label="Código de Barras"
                                value={localProduct.codigoDeBarras}
                                setValue={(v) => setField('codigoDeBarras', v as string)}
                            />
                        </div>
                    </section>

                    <section className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm">
                        <div className="flex items-center gap-sm mb-lg">
                            <div className="h-6">
                                <CashIcon size="fill" color="#0058be" />
                            </div>
                            <h2 className="font-h3 text-h3 text-primary">Precios</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-lg">
                            <ProductDetailsInput
                                id="product-retail-price"
                                label="Precio Menudeo"
                                value={localProduct.precioMenudeo}
                                setValue={(v) => setField('precioMenudeo', v as number)}
                                symbol="$" isNumber={true}
                            />
                            <ProductDetailsInput
                                id="product-wholesale-price"
                                label="Precio Mayoreo"
                                value={localProduct.precioMayoreo}
                                setValue={(v) => setField('precioMayoreo', v as number)}
                                symbol="$" isNumber={true}
                            />
                            <ProductDetailsInput
                                id="product-store-price"
                                label="Precio Tienda"
                                value={localProduct.precioTienda}
                                setValue={(v) => setField('precioTienda', v as number)}
                                symbol="$" isNumber={true}
                            />
                            <ProductDetailsInput
                                id="product-price-with-vat"
                                label="Precio con IVA"
                                value={localProduct.precioConIva}
                                setValue={(v) => setField('precioConIva', v as number)}
                                symbol="$" isNumber={true} isOnlyRead={true}
                            />
                            <ProductDetailsInput
                                id="product-policy-price"
                                label="Precio Política"
                                value={localProduct.precioPolitica}
                                setValue={(v) => setField('precioPolitica', v as number)}
                                symbol="$" isNumber={true} isOnlyRead={true}
                            />
                            <ProductDetailsInput
                                id="product-minimum-wholesale"
                                label="Mínimo Mayoreo"
                                value={localProduct.minimoMayoreo}
                                setValue={(v) => setField('minimoMayoreo', v as number)}
                                symbol={Number(localProduct.minimoMayoreo) === 1 ? "ud." : "uds."}
                                isNumber={true}
                            />
                        </div>
                        <div className="mt-lg pt-lg border-t border-outline-variant grid grid-cols-1 md:grid-cols-2 gap-lg">
                            <ProductDetailsInput
                                id="product-supplier"
                                label="Proveedor"
                                value={localProduct.proveedor}
                                setValue={(v) => setField('proveedor', v as string)}
                            />
                            <ProductDetailsInput
                                id="product-profit-margin"
                                label="Porcentaje Utilidad"
                                value={localProduct.porcentajeUtilidadReal}
                                setValue={(v) => setField('porcentajeUtilidadReal', v as number)}
                                symbol="%" isNumber={true} isOnlyRead={true}
                            />
                        </div>
                    </section>
                </div>
            </div>
        </section>
    )
}