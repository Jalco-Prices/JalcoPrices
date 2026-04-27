import { Request, Response } from 'express'
import Product from '../models/Product'

const PUBLIC_FIELDS = {
    _id: 1, nombre: 1, nombreGenerico: 1, categoria: 1, precioMayoreo: 1, precioMenudeo: 1, minimoMayoreo: 1, codigoDeBarras: 1, imagen: 1
}

export const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const isAdmin = (req as any).user?.isAdmin

        const products = isAdmin
            ? await Product.find()
            : await Product.find({}, PUBLIC_FIELDS)
        
        res.status(200).json(products)
    } catch {
        res.status(500).json({ error: 'Error obteniendo productos' })
    }
}