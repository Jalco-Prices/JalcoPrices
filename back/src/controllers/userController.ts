import 'dotenv/config'
import { Request, Response } from 'express'
import { createClerkClient } from '@clerk/backend'
import User from '../models/User'

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! })

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const isAdmin = (req as any).user?.isAdmin

        if (!isAdmin) {
            res.status(403).json({ error: 'Usuario sin permisos' })
            return
        }

        const users = await User.find()
        res.status(200).json({ users })
    } catch (error) {
        console.error('Error obteniendo usuarios:', error)
        res.status(500).json({ error: 'Error obteniendo usuarios' })
    }
}

export const getUserIsAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
        const isAdmin = (req as any).user?.isAdmin

        res.status(200).json({ isAdmin })
    } catch (error) {
        console.error('Error obteniendo permisos de usuario:', error)
        res.status(500).json({ error: 'Error obteniendo permisos de usuario' })
    }
}

export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
    try {
        const isAdmin = (req as any).user?.isAdmin

        if (!isAdmin) {
            res.status(403).json({ error: 'Usuario sin permisos' })
            return
        }

        const { userId, newRole } = req.body

        if (!userId || !newRole || !['admin', 'user'].includes(newRole)) {
            res.status(400).json({ error: 'Datos inválidos' })
            return
        }

        const user = await User.findById(userId)

        if (!user) {
            res.status(404).json({ error: 'Usuario no encontrado' })
            return
        }

        user.isAdmin = newRole === 'admin'
        await user.save()

        res.status(200).json({ message: 'Rol de usuario actualizado' })
    } catch (error) {
        console.error('Error actualizando rol de usuario:', error)
        res.status(500).json({ error: 'Error actualizando rol de usuario' })
    }
}

export const updateUserStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const isAdmin = (req as any).user?.isAdmin

        if (!isAdmin) {
            res.status(403).json({ error: 'Usuario sin permisos' })
            return
        }

        const { userId, newStatus } = req.body

        if (!userId || typeof newStatus !== 'boolean') {
            res.status(400).json({ error: 'Datos inválidos' })
            return
        }

        const user = await User.findById(userId)

        if (!user) {
            res.status(404).json({ error: 'Usuario no encontrado' })
            return
        }

        user.isDisabled = newStatus
        await user.save()

        res.status(200).json({ message: 'Estado de usuario actualizado' })
    } catch (error) {
        console.error('Error actualizando estado de usuario:', error)
        res.status(500).json({ error: 'Error actualizando estado de usuario' })
    }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const isAdmin = (req as any).user?.isAdmin

        if (!isAdmin) {
            res.status(403).json({ error: 'Usuario sin permisos' })
            return
        }

        const userId = req.body.userId as string
        
        if (!userId) {
            res.status(400).json({ error: 'ID de usuario es requerido' })
            return
        }

        try {
            await clerkClient.users.deleteUser(userId)
        } catch (error) {
            console.error('Error eliminando usuario de Clerk:', error)
            res.status(500).json({ error: 'Error eliminando usuario' })
        }

        res.status(200).json({ message: 'Usuario eliminado' })
    } catch (error) {
        console.error('Error eliminando usuario:', error)
        res.status(500).json({ error: 'Error eliminando usuario' })
    }
}