// Icons
import { XIcon } from '@/icons/Icons'


export default function DeleteModalComponent(
    { toDeleteName, isDeleteButtonDisabled, isOpen, setIsOpen, deleteAction }
    :
    { readonly toDeleteName: string, readonly isDeleteButtonDisabled: boolean, readonly isOpen: boolean, readonly setIsOpen: (isOpen: boolean) => void, readonly deleteAction: () => void }
) {
    if (!isOpen) return null

    return (
        <section className="fixed inset-0 z-100 flex items-center justify-center">
            {/* Backdrop - detrás del contenido */}
            <button
                className="absolute inset-0 backdrop-blur-sm bg-black/60"
                onClick={() => setIsOpen(false)}
            />

            {/* Modal Content - encima del backdrop */}
            <div className="relative z-1 overflow-auto max-w-100 p-lg border rounded-xl shadow-2xl font-inter bg-surface-container-lowest border-outline-variant">
                {/* Content Container */}
                <div className="flex flex-col gap-lg">
                    {/* Modal Header */}
                    <div className="flex justify-between items-center w-full">
                        <h3 className="text-primary">Eliminar Producto</h3>
                        
                        {/* Close Button */}
                        <button
                            className='cursor-pointer transition-transform active:scale-95'
                            onClick={() => setIsOpen(false)}
                        >
                            <XIcon size={24} color='#45464d' />
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="space-y-md">
                        <p className="text-justify text-on-surface-variant">Estás seguro de querer eliminar este producto? Esta acción no se podrá deshacer y se eliminará <span className="font-semibold text-on-surface">{`'${toDeleteName || 'producto sin nombre'}'`}</span> del inventario.</p>
                    </div>

                    {/* Modal Actions */}
                    <div className="flex items-center justify-end gap-md mt-md">
                        <button
                            className="px-lg py-sm font-medium transition-colors rounded-lg cursor-pointer text-on-surface-variant hover:bg-surface-container active:scale-95"
                            onClick={() => setIsOpen(false)}
                        >
                            Cancelar
                        </button>

                        <button
                            disabled={isDeleteButtonDisabled}
                            className="px-lg py-sm rounded-lg font-medium transition-all shadow-sm cursor-pointer text-on-error bg-error hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 disabled:text-white disabled:border-primary disabled:bg-primary"
                            onClick={deleteAction}
                        >
                            Eliminar Producto
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}