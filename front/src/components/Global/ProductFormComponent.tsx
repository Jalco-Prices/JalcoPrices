'use client';

// Components
import ProductDetailsInput from "../Inputs/ProductDetailsInput"
import BarcodeModalComponent from "./BarcodeModalComponent";
// Models
import { ProductType, AnyProductType } from "@/models/ProductModel"
// Icons
import { BarcodeIcon, InfoCircleIcon, CashIcon, LinkIcon, ArrowDownIcon, ArrowUpIcon, CheckIcon } from "@/icons/Icons"
// Images
import ImageNotFound from "@/assets/images/ImageNotFound.png"
// Utils
import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react"
import Image from "next/image"  

type typeOptions = "create" | "details"

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


export default function ProductFormComponent(
    { type, product, complementProducts, localProduct, isShowBarcode, setLocalProduct, setIsShowBarcode }
    :
    {
        readonly type: typeOptions, readonly product?: ProductType, readonly complementProducts?: AnyProductType[], readonly localProduct: ProductType, readonly isShowBarcode: boolean,
        readonly setLocalProduct: Dispatch<SetStateAction<ProductType>>, readonly setIsShowBarcode: (show: boolean) => void
    }
) {
    const [productUpdatedAt, setProductUpdatedAt] = useState(product?.updatedAt)
    const [isMounted, setIsMounted] = useState(false)
    const [isShowRelatedProducts, setIsShowRelatedProducts] = useState(false)
    const [selectedProducts, setSelectedProducts] = useState<AnyProductType[]>([]);

    const updatedAtRef = useRef(product?.updatedAt)

    // Handle complement products selection
    const handleToggleProduct = (product: AnyProductType) => {
        setSelectedProducts(prev => {
            const isSelected = prev.some(p => p._id === product._id);
            return isSelected
                ? prev.filter(p => p._id !== product._id)
                : [...prev, product];
        });
    };

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

    // Refresh productUpdatedAt every second
    useEffect(() => {
        const interval = setInterval(() => {
            setIsMounted(true)
            const currentUpdatedAt = updatedAtRef.current ? formatUpdatedAt(updatedAtRef.current) : ""
            setProductUpdatedAt(currentUpdatedAt)
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    // Update updatedAtRef whenever localProduct.updatedAt changes
    useEffect(() => {
        updatedAtRef.current = localProduct.updatedAt
    }, [localProduct.updatedAt])

    return (
        <>
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
                                unoptimized={true}
                            />
                        </div>
                        <button
                            className="w-full py-sm flex items-center justify-center gap-2 border rounded-lg transition-all hover:cursor-pointer active:scale-95 text-primary border-outline-variant/20 bg-surface-container hover:bg-surface-container-high"
                            onClick={() => setIsShowBarcode(true)}
                        >
                            <div className="h-5">
                                <BarcodeIcon size="fill" />
                            </div>
                            Código de Barras
                        </button>
                    </div>

                    {/* Product Metadata */}
                    {type === "details" &&
                        <div className="bg-surface-container-low p-lg rounded-xl border border-outline-variant">
                            <h3 className="font-label-caps text-label-caps text-on-primary-container mb-md">Metadatos</h3>
                            <div className="space-y-sm">
                                <div className="flex justify-between items-center py-sm font-inter border-b border-outline-variant/30">
                                    <span className="text-on-surface-variant">Creado</span>
                                    <span className="text-on-surface">{localProduct.createdAt ? formatCreatedAt(localProduct.createdAt) : ""}</span>
                                </div>
                                <div className="flex justify-between items-center pt-sm font-inter">
                                    <span className="text-on-surface-variant">Modificado</span>
                                    <span className="text-on-surface">
                                        {isMounted ? productUpdatedAt : localProduct.updatedAt ? formatUpdatedAt(localProduct.updatedAt) : ""}
                                    </span>
                                </div>
                            </div>
                        </div>
                    }
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
                                wasChanged={product && localProduct.nombre !== product.nombre}
                                isRequired={type === "create"}
                            />
                            <ProductDetailsInput
                                id="product-category"
                                label="Categoría"
                                value={localProduct.categoria}
                                setValue={(v) => setField('categoria', v as string)}
                                wasChanged={product && localProduct.categoria !== product.categoria}
                                isRequired={type === "create"}
                            />
                            <ProductDetailsInput
                                id="product-generic-name"
                                label="Rosca"
                                value={localProduct.nombreGenerico}
                                setValue={(v) => setField('nombreGenerico', v as string)}
                                wasChanged={product && localProduct.nombreGenerico !== product.nombreGenerico}
                                isRequired={type === "create"}
                            />
                            <ProductDetailsInput
                                id="product-barcode"
                                label="Código de Barras"
                                value={localProduct.codigoDeBarras}
                                setValue={(v) => setField('codigoDeBarras', v as string)}
                                wasChanged={product && localProduct.codigoDeBarras !== product.codigoDeBarras}
                            />
                            <div className="md:col-span-2">
                                <ProductDetailsInput
                                    id="product-image"
                                    label="Imagen"
                                    value={localProduct.imagen}
                                    setValue={(v) => setField('imagen', v as string)}
                                    wasChanged={product && localProduct.imagen !== product.imagen}
                                />
                            </div>
                        </div>
                    </section>

                    <section className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm">
                        <div className="flex items-center gap-sm mb-lg">
                            <div className="h-6">
                                <CashIcon size="fill" color="#0058be" />
                            </div>
                            <h2 className="font-inter text-h3 text-primary">Precios</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-lg">
                            <ProductDetailsInput
                                id="product-retail-price"
                                label="Precio Menudeo"
                                value={localProduct.precioMenudeo}
                                setValue={(v) => setField('precioMenudeo', v as number)}
                                symbol="$" isNumber={true}
                                wasChanged={product && Number(localProduct.precioMenudeo) !== Number(product.precioMenudeo)}
                            />
                            <ProductDetailsInput
                                id="product-wholesale-price"
                                label="Precio Mayoreo"
                                value={localProduct.precioMayoreo}
                                setValue={(v) => setField('precioMayoreo', v as number)}
                                symbol="$" isNumber={true}
                                wasChanged={product && Number(localProduct.precioMayoreo) !== Number(product.precioMayoreo)}
                            />
                            <ProductDetailsInput
                                id="product-store-price"
                                label="Precio Tienda"
                                value={localProduct.precioTienda}
                                setValue={(v) => setField('precioTienda', v as number)}
                                symbol="$" isNumber={true}
                                wasChanged={product && Number(localProduct.precioTienda) !== Number(product.precioTienda)}
                            />
                            <ProductDetailsInput
                                id="product-price-with-vat"
                                label="Precio con IVA"
                                value={localProduct.precioConIva}
                                setValue={(v) => setField('precioConIva', v as number)}
                                symbol="$" isNumber={true} isOnlyRead={true}
                                wasChanged={product && Number(localProduct.precioConIva) !== Number(product.precioConIva)}
                            />
                            <ProductDetailsInput
                                id="product-policy-price"
                                label="Precio Política"
                                value={localProduct.precioPolitica}
                                setValue={(v) => setField('precioPolitica', v as number)}
                                symbol="$" isNumber={true} isOnlyRead={true}
                                wasChanged={product && Number(localProduct.precioPolitica) !== Number(product.precioPolitica)}
                            />
                            <ProductDetailsInput
                                id="product-minimum-wholesale"
                                label="Mínimo Mayoreo"
                                value={localProduct.minimoMayoreo}
                                setValue={(v) => setField('minimoMayoreo', v as number)}
                                symbol={Number(localProduct.minimoMayoreo) === 1 ? "ud." : "uds."}
                                isNumber={true}
                                wasChanged={product && Number(localProduct.minimoMayoreo) !== Number(product.minimoMayoreo)}
                            />
                        </div>
                        <div className="mt-lg pt-lg border-t border-outline-variant grid grid-cols-1 md:grid-cols-2 gap-lg">
                            <ProductDetailsInput
                                id="product-supplier"
                                label="Proveedor"
                                value={localProduct.proveedor}
                                setValue={(v) => setField('proveedor', v as string)}
                                wasChanged={product && localProduct.proveedor !== product.proveedor}
                            />
                            <ProductDetailsInput
                                id="product-profit-margin"
                                label="Porcentaje Utilidad"
                                value={localProduct.porcentajeUtilidadReal}
                                setValue={(v) => setField('porcentajeUtilidadReal', v as number)}
                                symbol="%" isNumber={true} isOnlyRead={true}
                                wasChanged={product && Number(localProduct.porcentajeUtilidadReal) !== Number(product.porcentajeUtilidadReal)}
                            />
                        </div>
                    </section>

                    {/* Complement Products Section */}
                    {type === "details" &&
                        <section className="overflow-hidden rounded-xl border shadow-sm border-outline-variant bg-surface-container-lowest">
                            {/* Section Header */}
                            <button
                                className="group w-full flex items-start sm:items-center justify-between p-lg transition-colors cursor-pointer hover:bg-surface-container-low"
                                onClick={() => setIsShowRelatedProducts(!isShowRelatedProducts)}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center gap-sm">
                                    <div className="flex items-center gap-sm">
                                        {/* Section Icon */}
                                        <div className="h-6">
                                            <LinkIcon size="fill" color="#0058be" />
                                        </div>

                                        {/* Section Title */}
                                        <h2 className="font-inter text-h3 text-primary">Complementos</h2>
                                    </div>

                                    {/* Selected Count */}
                                    <p className="ml-md w-fit px-2 py-0.5 text-xs font-bold rounded-full text-secondary bg-secondary/10">
                                        {selectedProducts.length} SELECCIONADOS
                                    </p>
                                </div>
                                
                                {/* Arrows Icon */}
                                <div className="h-6">
                                    {isShowRelatedProducts
                                        ?   <ArrowUpIcon size="fill" color="#45464d" />
                                        :   <ArrowDownIcon size="fill" color="#45464d" />
                                    }
                                </div>
                            </button>

                            {/* Content Section */}
                            {isShowRelatedProducts && complementProducts && complementProducts.length > 0 &&
                                <div className="p-lg pt-0 border-t transition-all duration-300 border-outline-variant/30">
                                    {/* Products Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-md mt-lg">
                                        {complementProducts.map((product: AnyProductType) => {
                                            const isSelected = selectedProducts.some(p => p._id === product._id);
                                            return (
                                                <button
                                                    key={product._id}
                                                    onClick={() => handleToggleProduct(product)}
                                                    className={`relative p-md text-left border-2 rounded-xl cursor-pointer transition-all bg-surface-container-lowest
                                                        ${isSelected
                                                            ? "border-secondary ring-2 ring-secondary/20 hover:shadow-md"
                                                            : "border-outline-variant hover:border-outline"
                                                        }`}
                                                >
                                                    {/* Checkmark Icon */}
                                                    {isSelected && (
                                                        <div className="absolute z-10 top-2 right-2 p-0.75 rounded-full flex items-center justify-center bg-secondary">
                                                            <div className="h-3.75">
                                                                <CheckIcon size="fill" color="white" />
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="flex gap-md">
                                                        <div className="overflow-hidden relative w-20 h-20 rounded-lg shrink-0 bg-surface-container">
                                                            <Image
                                                                src={product.imagen == "" || product.imagen == null ? ImageNotFound : product.imagen}
                                                                alt={`${product.nombre} Image`}
                                                                fill
                                                                className="object-cover"
                                                                loading="eager"
                                                            />
                                                        </div>

                                                        <div className="flex flex-col justify-between">
                                                            <h4 className="font-inter font-semibold line-clamp-2 text-primary">
                                                                {product.nombre}
                                                            </h4>

                                                            <div className="space-y-1 text-xs font-inter text-on-surface-variant">
                                                                <p>Menudeo <span className="text-on-surface">${product.precioMenudeo.toFixed(2)}</span></p>
                                                                <p>Mayoreo <span className="text-on-surface">${product.precioMayoreo.toFixed(2)}</span></p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            }
                        </section>
                    }
                </div>
            </div>

            {/* Barcode Modal */}
            {isShowBarcode &&
                <BarcodeModalComponent
                    name={localProduct.nombre}
                    barcode={localProduct.codigoDeBarras}
                    menudeo={localProduct.precioMenudeo}
                    mayoreo={localProduct.precioMayoreo}
                    selectedProducts={selectedProducts}
                    setIsShowBarcode={setIsShowBarcode}
                />
            }
        </>
    )
}