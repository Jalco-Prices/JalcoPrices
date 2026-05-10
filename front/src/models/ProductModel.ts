


export type ProductType = {
    _id?: string
    nombre: string
    nombreGenerico: string
    categoria: string
    precioMayoreo: number
    precioMenudeo: number
    precioTienda: number
    precioConIva: number
    precioPolitica: number
    porcentajeUtilidadReal: number
    proveedor: string
    minimoMayoreo: number
    codigoDeBarras: string
    imagen: string
    vecesVisto?: number
    createdAt?: string
    updatedAt?: string
}

export type ProductPublicType = Pick<ProductType,
    '_id' | 'nombre' | 'nombreGenerico' | 'categoria' | 'precioMayoreo' | 'precioMenudeo' | 'minimoMayoreo' | 'codigoDeBarras' | 'imagen'
>

export type AnyProductType = ProductType | ProductPublicType

export const isAdminProduct = (product: AnyProductType): product is ProductType => {
    return 'precioTienda' in product
}