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
    } catch (error) {
        console.error('Error obteniendo productos:', error)
        res.status(500).json({ error: 'Error obteniendo productos' })
    }
}

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const isAdmin = (req as any).user?.isAdmin

        if (!isAdmin) {
            res.status(403).json({ error: 'Usuario sin permisos' })
            return
        }

        const { _id, ...updateData } = req.body

        if (!_id) {
            res.status(400).json({ error: 'ID del producto es requerido' })
            return
        }

        const updatedProduct = await Product.findByIdAndUpdate(_id, updateData, { new: true })

        if (!updatedProduct) {
            res.status(404).json({ error: 'Producto no encontrado' })
            return
        }

        res.status(200).json({ message: 'Producto actualizado correctamente' })
    } catch (error) {
        console.error('Error actualizando producto:', error)
        res.status(500).json({ error: 'Error actualizando producto' })
    }
}