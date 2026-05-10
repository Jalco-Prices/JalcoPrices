import { Request, Response } from 'express'
import User from '../models/User'

export const getUserIsAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const isAdmin = (req as any).user?.isAdmin

        res.status(200).json({ isAdmin })
    } catch (error) {
        console.error('Error obteniendo permisos de usuario:', error)
        res.status(500).json({ error: 'Error obteniendo permisos de usuario' })
    }
}