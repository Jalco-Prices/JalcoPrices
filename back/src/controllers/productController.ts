import { Request, Response } from 'express'
import Product from '../models/Product'

const PUBLIC_FIELDS = {
    _id: 1, nombre: 1, nombreGenerico: 1, categoria: 1, precioMayoreo: 1, precioMenudeo: 1, minimoMayoreo: 1, codigoDeBarras: 1, imagen: 1, vecesVisto: 1
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

export const addProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const isAdmin = (req as any).user?.isAdmin

        if (!isAdmin) {
            res.status(403).json({ error: 'Usuario sin permisos' })
            return
        }

        const newProduct = new Product(req.body)
        await newProduct.save()

        res.status(201).json({ id: newProduct._id, message: 'Producto agregado correctamente' })
    } catch (error) {
        console.error('Error agregando producto:', error)
        res.status(500).json({ error: 'Error agregando producto' })
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

        const updatedProduct = await Product.findByIdAndUpdate(_id, updateData, { returnDocument: 'after' })

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

export const updateProductViews = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id: _id } = req.body

        if (!_id) {
            res.status(400).json({ error: 'ID del producto es requerido' })
            return
        }

        const updatedProduct = await Product.findByIdAndUpdate(_id, { $inc: { vecesVisto: 1 } }, { returnDocument: 'after' })

        if (!updatedProduct) {
            res.status(404).json({ error: 'Producto no encontrado' })
            return
        }

        res.status(200).json({ message: 'Visitas del producto actualizadas correctamente' })
    } catch (error) {
        console.error('Error actualizando visitas del producto:', error)
        res.status(500).json({ error: 'Error actualizando visitas del producto' })
    }
}

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const isAdmin = (req as any).user?.isAdmin

        if (!isAdmin) {
            res.status(403).json({ error: 'Usuario sin permisos' })
            return
        }

        const { productId: _id } = req.params

        if (!_id) {
            res.status(400).json({ error: 'ID del producto es requerido' })
            return
        }

        const deletedProduct = await Product.findByIdAndDelete(_id)

        if (!deletedProduct) {
            res.status(404).json({ error: 'Producto no encontrado' })
            return
        }

        res.status(200).json({ message: 'Producto eliminado correctamente' })
    } catch (error) {
        console.error('Error eliminando producto:', error)
        res.status(500).json({ error: 'Error eliminando producto' })
    }
}