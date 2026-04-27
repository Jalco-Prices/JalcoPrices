import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '@clerk/backend'
import User from '../models/User'

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader) {
            console.error('Token no proporcionado')
            res.status(401).json({ error: 'Token no proporcionado' })
            return
        }

        const token = authHeader.split(' ')[1]

        if (!token) {
            console.error('Formato de token inválido')
            res.status(401).json({ error: 'Formato de token inválido' })
            return
        }

        const payload = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY,
        })

        const userId = payload.sub

        const user = await User.findOne({ userId })

        if (!user) {
            console.error('Usuario no encontrado')
            res.status(404).json({ error: 'Usuario no encontrado' })
            return
        }

        if (user.isDisabled) {
            console.error('Usuario deshabilitado')
            res.status(403).json({ error: 'Usuario deshabilitado' })
            return
        }

        ;(req as any).user = user
        next()
    } catch {
        console.error('Error de autenticación')
        res.status(401).json({ error: 'No autorizado' })
    }
}