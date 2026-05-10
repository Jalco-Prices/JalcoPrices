
// Utils
import Barcode from 'react-barcode'


export default function BarcodeModalComponent(
    { name, barcode, setIsShowBarcode }
    :
    { readonly name: string, readonly barcode: string, readonly setIsShowBarcode: (show: boolean) => void }
) {
    return (
        <section className="z-100 fixed top-0 left-0 h-svh w-full flex items-center justify-center bg-transparent">
            <div className="z-102 relative max-w-130 p-lg w-full flex flex-col gap-lg rounded-xl shadow-2xl border bg-surface-container-lowest border-outline-variant">
                {/* Product Information */}
                <div className="w-full text-center font-inter">
                    <h3 className="mb-xs text-primary">{name}</h3>
                    <p className="text-on-surface-variant">Código de Barras</p>
                </div>

                {/* Barcode Display */}
                <div className="w-full flex items-center justify-center p-lg rounded-lg border border-outline-variant bg-white">
                    <Barcode
                        value={barcode || "0000000000000"}
                        format="CODE128"
                        width={2}
                        height={100}
                        displayValue={false}
                    />
                </div>

                {/* Barcode Value */}
                <h1 className="text-center font-tabular-nums text-h2 tracking-widest truncate text-primary">{barcode}</h1>

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
    )
}