// Models
import { AnyProductType } from "@/models/ProductModel";
// Icons
import { CheckIcon } from "@/icons/Icons";
// Images
import ImageNotFound from "@/assets/images/ImageNotFound.png"
// Utils
import Image from "next/image";


export default function RelatedProductsGridComponent(
    { complementProducts, selectedProducts, handleToggleProduct }
    :
    { readonly complementProducts: AnyProductType[], readonly selectedProducts: AnyProductType[], readonly handleToggleProduct: (product: AnyProductType) => void }
) {
    return (
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
                                    <p>May mín. <span className="text-on-surface">{product.minimoMayoreo} {product.minimoMayoreo == 1 ? "ud." : "uds."}</span></p>
                                </div>
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    )
}