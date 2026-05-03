import mongoose, { Document, Schema } from 'mongoose'

export interface IProduct extends Document {
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
    vecesVisto: number
}

const ProductSchema = new Schema<IProduct>(
    {
        nombre: { type: String, required: true, unique: true },
        nombreGenerico: { type: String, required: true },
        categoria: { type: String, required: true },
        precioMayoreo: { type: Number, default: 0 },
        precioMenudeo: { type: Number, default: 0 },
        precioTienda: { type: Number, default: 0 },
        precioConIva: { type: Number, default: 0 },
        precioPolitica: { type: Number, default: 0 },
        porcentajeUtilidadReal: { type: Number, default: 0 },
        proveedor: { type: String, default: '' },
        minimoMayoreo: { type: Number, default: 0 },
        codigoDeBarras: { type: String, default: '' },
        imagen: { type: String, default: '' },
        vecesVisto: { type: Number, default: 0 },
    },
    { timestamps: true }
)

export default mongoose.model<IProduct>('Product', ProductSchema)