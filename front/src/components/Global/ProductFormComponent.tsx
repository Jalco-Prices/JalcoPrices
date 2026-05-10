// Components
import ProductDetailsInput from "../Inputs/ProductDetailsInput"
// Models
import { ProductType } from "@/models/ProductModel"
// Icons
import { BarcodeIcon, InfoCircleIcon, CashIcon } from "@/icons/Icons"
// Images
import ImageNotFound from "@/assets/images/ImageNotFound.png"
// Utils
import { Dispatch, SetStateAction } from "react"
import Image from "next/image"
import Barcode from 'react-barcode'

type typeOptions = "create" | "details"


export default function ProductFormComponent(
    { type, product, localProduct, isShowBarcode, setLocalProduct, setIsShowBarcode, isMounted, productUpdatedAt, formatCreatedAt, formatUpdatedAt }
    :
    {
        readonly type: typeOptions, readonly product?: ProductType, readonly localProduct: ProductType, readonly isShowBarcode: boolean,
        readonly setLocalProduct: Dispatch<SetStateAction<ProductType>>, readonly setIsShowBarcode: (show: boolean) => void, readonly isMounted?: boolean,
        readonly productUpdatedAt?: string, readonly formatCreatedAt?: (dateString: string) => string, readonly formatUpdatedAt?: (dateString: string) => string
    }
) {

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
                                    <span className="text-on-surface">{formatCreatedAt?(localProduct.createdAt):""}</span>
                                </div>
                                <div className="flex justify-between items-center pt-sm font-inter">
                                    <span className="text-on-surface-variant">Modificado</span>
                                    <span className="text-on-surface">
                                        {isMounted ? productUpdatedAt : formatUpdatedAt?(localProduct.updatedAt):""}
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
                            />
                            <ProductDetailsInput
                                id="product-category"
                                label="Categoría"
                                value={localProduct.categoria}
                                setValue={(v) => setField('categoria', v as string)}
                                wasChanged={product && localProduct.categoria !== product.categoria}
                            />
                            <ProductDetailsInput
                                id="product-generic-name"
                                label="Rosca"
                                value={localProduct.nombreGenerico}
                                setValue={(v) => setField('nombreGenerico', v as string)}
                                wasChanged={product && localProduct.nombreGenerico !== product.nombreGenerico}
                            />
                            <ProductDetailsInput
                                id="product-barcode"
                                label="Código de Barras"
                                value={localProduct.codigoDeBarras}
                                setValue={(v) => setField('codigoDeBarras', v as string)}
                                wasChanged={product && localProduct.codigoDeBarras !== product.codigoDeBarras}
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
                </div>
            </div>

            {/* Barcode Modal */}
            {isShowBarcode &&
                <section className="z-100 fixed top-0 left-0 h-svh w-full flex items-center justify-center bg-transparent">
                    <div className="z-102 relative max-w-130 p-lg w-full flex flex-col gap-lg rounded-xl shadow-2xl border bg-surface-container-lowest border-outline-variant">
                        {/* Product Information */}
                        <div className="w-full text-center font-inter">
                            <h3 className="mb-xs text-primary">{localProduct.nombre}</h3>
                            <p className="text-on-surface-variant">Código de Barras</p>
                        </div>

                        {/* Barcode Display */}
                        <div className="w-full flex items-center justify-center p-lg rounded-lg border border-outline-variant bg-white">
                            <Barcode
                                value={localProduct.codigoDeBarras || "0000000000000"}
                                format="CODE128"
                                width={2}
                                height={100}
                                displayValue={false}
                            />
                        </div>

                        {/* Barcode Value */}
                        <h1 className="text-center font-tabular-nums text-h2 tracking-widest truncate text-primary">{localProduct.codigoDeBarras}</h1>

                        {/* Close Button */}
                        <button
                            className="w-full py-sm rounded-lg font-medium shadow-sm cursor-pointer transition-all hover:opacity-90 active:scale-95 text-on-primary bg-primary"
                            onClick={() => setIsShowBarcode(false)}
                        >
                            Close
                        </button>
                    </div>

                    <button
                        className="z-101 absolute top-0 left-0 w-full h-full backdrop-blur-sm bg-black/60"
                        onClick={() => setIsShowBarcode(false)}
                    />
                </section>
            }
        </>
    )
}