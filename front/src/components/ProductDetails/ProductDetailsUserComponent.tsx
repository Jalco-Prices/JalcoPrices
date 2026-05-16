'use client';

// Components
import ReturnButtonComponent from "../Buttons/ReturnButtonComponent"
import BarcodeModalComponent from "../Global/BarcodeModalComponent"
// Models
import { ProductPublicType, AnyProductType } from "@/models/ProductModel"
// Icons
import { BarcodeIcon, RosetteDiscountCheckIcon, LinkIcon, ArrowDownIcon, ArrowUpIcon, CheckIcon } from "@/icons/Icons"
// Images
import ImageNotFound from "@/assets/images/ImageNotFound.png"
// Utils
import { useState } from "react";
import Image from "next/image"


export default function ProductDetailsUserComponent(
    { product, complementProducts }
    :
    { readonly product: ProductPublicType, readonly complementProducts: AnyProductType[] }
) {
    const [isShowBarcode, setIsShowBarcode] = useState(false)
    const [isShowRelatedProducts, setIsShowRelatedProducts] = useState(false)
    const [selectedProducts, setSelectedProducts] = useState<AnyProductType[]>([]);

    const handleToggleProduct = (product: AnyProductType) => {
        setSelectedProducts(prev => {
            const isSelected = prev.some(p => p._id === product._id);
            return isSelected
                ? prev.filter(p => p._id !== product._id)
                : [...prev, product];
        });
    };

    const wholeSaleWithComplementsPrice = selectedProducts.reduce((total, p) => total + p.precioMayoreo, product.precioMayoreo)
    const retailWithComplementsPrice = selectedProducts.reduce((total, p) => total + p.precioMenudeo, product.precioMenudeo)

    return (
        <>
            <section className="section-container">
                <ReturnButtonComponent />
                
                {/* Main Wrapper */}    
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Image Container */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="relative overflow-hidden aspect-square rounded-xl custom-shadow border border-outline-variant/30 bg-white">
                            <Image
                                src={product.imagen == "" || product.imagen == null ? ImageNotFound : product.imagen}
                                alt={`${product.nombre} Image`}
                                fill
                                className="object-cover"
                                sizes="undefined"
                                loading="eager"
                            />
                        </div>
                    </div>

                    {/* Info Container */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        {/* Primary Info Card */}
                        <div className="bg-white p-lg rounded-xl custom-shadow border border-outline-variant/30">
                            {/* Product Name and Barcode */}
                            <div className="flex max-sm:flex-col-reverse justify-between mb-4 gap-4">
                                {/* Product Name */}
                                <div className="min-w-0">
                                    <span className="font-inter text-secondary">{product.nombre}</span>
                                </div>

                                {/* Barcode Button */}
                                <button
                                    className="shrink-0 h-10.5 max-sm:w-fit px-4 flex items-center gap-2 rounded-lg transition-all active:scale-95 border hover:cursor-pointer text-primary border-outline-variant/20 bg-surface-container hover:bg-surface-container-high"
                                    onClick={() => setIsShowBarcode(true)}
                                >
                                    <BarcodeIcon size={20} />
                                    <span className="font-inter">Código de Barras</span>
                                </button>
                            </div>

                            {/* Product Details */}
                            <div className="space-y-6 mt-8">
                                <div className="grid grid-cols-2 gap-4 pb-6 border-b border-surface-container">
                                    <div className="font-inter gap-1">
                                        <p className="text-on-surface-variant">CATEGORÍA</p>
                                        <p className="text-primary">{product.categoria}</p>
                                    </div>

                                    <div className="font-inter gap-1">
                                        <p className="text-on-surface-variant">ROSCA</p>
                                        <p className="text-primary">{product.nombreGenerico}</p>
                                    </div>
                                </div>  

                                {/* Pricing Info */}
                                <div className="p-6 rounded-xl space-y-4 bg-surface-container-low">
                                    <div className="flex justify-between items-center font-inter">
                                        <span className="text-on-surface-variant">Precio Mayoreo</span>
                                        <span className="text-primary">${selectedProducts.length > 0 ? wholeSaleWithComplementsPrice : product.precioMayoreo}</span>
                                    </div>

                                    <div className="flex justify-between items-center pb-4 border-b border-outline-variant/20">
                                        <span className="font-inter text-on-primary-container italic">Mínimo: {product.minimoMayoreo} uds.</span>
                                        <RosetteDiscountCheckIcon size={24} color="#0058be" />
                                    </div>

                                    <div className="flex justify-between items-center pt-2 font-inter">
                                        <span className="text-on-surface-variant">Precio Menudeo</span>
                                        <span className="text-primary">${selectedProducts.length > 0 ? retailWithComplementsPrice : product.precioMenudeo}</span>
                                    </div>
                                </div>
                            
                                {/* Status Indicator */}
                                <div className="flex items-center gap-2">
                                    {true
                                        ?   (
                                                <>
                                                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                                                <span className="font-label-caps text-secondary">DISPONIBLE</span>
                                                </>
                                            )
                                        :   (
                                                <>
                                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                                <span className="font-label-caps text-red-500">AGOTADO</span>
                                                </>
                                            )
                                    }
                                </div>
                            </div>
                        </div>

                        {/* Complement Products Section */}
                        {complementProducts.length > 0 &&
                            <div className="overflow-hidden rounded-xl custom-shadow border border-outline-variant/30 bg-white">
                                {/* Section Header */}
                                <button
                                    className="group w-full flex items-center justify-between p-lg transition-colors cursor-pointer hover:bg-surface-container-low"
                                    onClick={() => setIsShowRelatedProducts(!isShowRelatedProducts)}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-sm">
                                        <div className="flex items-center gap-sm">
                                            <LinkIcon size={24} color="#0058be" />
                                            <h2 className="font-inter text-secondary">Complementos</h2>
                                        </div>

                                        <p className="ml-md w-fit px-2 py-0.5 text-xs font-bold rounded-full text-secondary bg-secondary/10">
                                            {selectedProducts.length} SELECCIONADOS
                                        </p>
                                    </div>
                                    {isShowRelatedProducts
                                        ? <ArrowUpIcon size={24} color="#45464d" />
                                        : <ArrowDownIcon size={24} color="#45464d" />
                                    }
                                </button>

                                {/* Products Grid */}
                                {isShowRelatedProducts &&
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
                                                                <CheckIcon size={15} color="white" />
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
                            </div>
                        }
                    </div>
                </div>
            </section>

            {/* Barcode Modal */}
            {isShowBarcode &&
                <BarcodeModalComponent
                    name={product.nombre}
                    barcode={product.codigoDeBarras}
                    menudeo={product.precioMenudeo}
                    mayoreo={product.precioMayoreo}
                    selectedProducts={selectedProducts}
                    setIsShowBarcode={setIsShowBarcode}
                />
            }
        </>
    )
}