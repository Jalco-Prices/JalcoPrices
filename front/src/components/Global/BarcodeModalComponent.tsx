// Models
import { AnyProductType } from '@/models/ProductModel'
// Icons
import { XIcon, ArrowLeftIcon, ArrowRightIcon, PlusIcon, MinusIcon } from '@/icons/Icons'
// Utils
import { useState } from 'react'
import Barcode from 'react-barcode'


export default function BarcodeModalComponent(
    { name, barcode, menudeo, mayoreo, selectedProducts, setIsShowBarcode }
    :
    { readonly name: string, readonly barcode: string, readonly menudeo: number, readonly mayoreo: number, readonly selectedProducts: AnyProductType[], readonly setIsShowBarcode: (show: boolean) => void }
) {
    const [isQuantityMode, setIsQuantityMode] = useState(false)
    const [quantityValue, setQuantityValue] = useState("1")
    const [currentIndex, setCurrentIndex] = useState(0)

    const barCodes = [
        { name: name, barcode: barcode, menudeo: menudeo, mayoreo: mayoreo }
    ]
    selectedProducts.forEach((product) => {
        barCodes.push({ name: product.nombre, barcode: product.codigoDeBarras, menudeo: product.precioMenudeo, mayoreo: product.precioMayoreo })
    })

    return (
        <section className="z-100 fixed top-0 left-0 h-svh w-full flex items-center justify-center bg-transparent">
            <div className="z-102 relative max-w-130 p-lg w-full flex flex-col gap-lg rounded-xl shadow-2xl border font-inter bg-surface-container-lowest border-outline-variant">
                {/* Header Section */}
                <section className='flex justify-between'>
                    {/* Title & Barcode State */}
                    <div>
                        <p className='text-primary'>Código de Barras</p>
                        {selectedProducts.length > 0 && <p className='text-body-sm text-on-surface-variant'>{currentIndex + 1} de {barCodes.length}</p>}
                    </div>

                    {/* Close Button */}
                    <button
                        className='h-6 cursor-pointer transition-transform active:scale-95'
                        onClick={() => setIsShowBarcode(false)}
                    >
                        <XIcon size={"fill"} color='#45464d' />
                    </button>
                </section>

                {/* Barcode Display */}
                <section className='flex flex-col gap-4'>
                    <div className="flex items-center justify-between gap-5">
                        {/* Left Button */}
                        {selectedProducts.length > 0 &&
                            <button
                                disabled={currentIndex === 0}
                                className="border shrink-0 rounded-full p-2 transition-all cursor-pointer active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 border-outline-variant"
                                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                            >
                                <div className="h-6">
                                    <ArrowLeftIcon size={"fill"} color='#45464d' />
                                </div>
                            </button>
                        }

                        <div className='flex-1 p-lg flex justify-center items-center rounded-lg border border-outline-variant bg-white'>
                            <Barcode
                                value={isQuantityMode ? quantityValue || "1" : barCodes[currentIndex]?.barcode || "000"}
                                format="CODE128"
                                width={1}
                                height={undefined}
                            />
                        </div>

                        {/* Right Button */}
                        {selectedProducts.length > 0 &&
                            <button
                                disabled={currentIndex === barCodes.length - 1}
                                className="border shrink-0 rounded-full p-2 transition-all cursor-pointer active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 border-outline-variant"
                                onClick={() => setCurrentIndex(currentIndex + 1)}
                            >
                                <div className="h-6">
                                    <ArrowRightIcon size={"fill"} color='#45464d' />
                                </div>
                            </button>
                        }
                    </div>

                    {/* Barcode Product Name */}
                    <div className="w-full text-center font-inter">
                        <h3 className="mb-xs font-medium text-center text-primary">
                            {barCodes[currentIndex]?.name || "Producto sin nombre"} {isQuantityMode && <span className='font-bold'>* {quantityValue}</span>}
                        </h3>

                        {isQuantityMode &&
                            <div className='text-sm text-on-surface-variant'>
                                <p>Menudeo: <span className='font-bold'>{Number(Number.parseInt(quantityValue) * barCodes[currentIndex]?.menudeo).toFixed(2) || "0.00"}</span></p>
                                <p>Mayoreo: <span className='font-bold'>{Number(Number.parseInt(quantityValue) * barCodes[currentIndex]?.mayoreo).toFixed(2) || "0.00"}</span></p>
                            </div>
                        }
                    </div>
                </section>

                {/* Quantity Mode Section */}
                <section className='flex flex-col gap-5 border-t pt-lg border-outline-variant/30'>
                    <div className='flex justify-between'>
                        {/* Quantity Mode Label and Description */}
                        <div>
                            <p className='text-sm font-bold text-primary'>Modo Cantidad</p>
                            <p className='text-xs text-on-surface-variant'>Mostrar código de barras de cantidad seleccionada</p>
                        </div>

                        {/* Quantity Mode Toggle Switch */}
                        <button
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                isQuantityMode ? 'bg-secondary' : 'bg-surface-container-highest'
                            }`}
                            role="switch"
                            type="button"
                            aria-checked={isQuantityMode}
                            onClick={() => setIsQuantityMode(!isQuantityMode)}
                        >
                            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                isQuantityMode ? 'translate-x-5' : 'translate-x-0'
                            }`} />
                        </button>
                    </div>

                    {/* Quantity Input & Buttons Actions */}
                    <div className="flex items-center justify-center gap-lg">
                        <button
                            className="w-10 h-10 rounded-lg border border-outline-variant flex items-center justify-center hover:bg-surface-container-low transition-colors"
                            onClick={() => setQuantityValue(String(Math.max(1, Number.parseInt(quantityValue) - 1)))}
                        >
                            <div className='h-6'>
                                <MinusIcon size={"fill"} />
                            </div>
                        </button>
                        
                        <input
                            className="no-spinner w-20 text-center font-tabular-nums text-lg font-bold border-none bg-transparent focus:ring-0"
                            type="number"
                            value={quantityValue}
                            onChange={(e) => setQuantityValue(e.target.value)}
                            onBlur={(e) => setQuantityValue(String(Math.max(1, Number.parseInt(e.target.value) || 1)))}
                        />
                        
                        <button
                            className="w-10 h-10 rounded-lg border border-outline-variant flex items-center justify-center hover:bg-surface-container-low transition-colors"
                            onClick={() => setQuantityValue(String(Number.parseInt(quantityValue) + 1))}
                        >
                            <div className='h-6'>
                                <PlusIcon size={"fill"} />
                            </div>
                        </button>
                    </div>
                </section>
            </div>

            <button
                className="z-101 absolute top-0 left-0 w-full h-full backdrop-blur-sm bg-black/60"
                onClick={() => setIsShowBarcode(false)}
            />
        </section>
    )
}