import { Request, Response } from 'express'
import { Webhook } from 'svix'
import User from '../models/User'

export const handleClerkWebhook = async (req: Request, res: Response): Promise<void> => {
    const secret = process.env.CLERK_WEBHOOK_SECRET
    if (!secret) {
        res.status(500).json({ error: 'CLERK_WEBHOOK_SECRET no está definida' })
        return
    }

    const wh = new Webhook(secret)

    let event: any
    try {
        event = wh.verify(JSON.stringify(req.body), {
            'svix-id': req.headers['svix-id'] as string,
            'svix-timestamp': req.headers['svix-timestamp'] as string,
            'svix-signature': req.headers['svix-signature'] as string,
        })
    } catch {
        res.status(400).json({ error: 'Firma de webhook no válida' })
        return
    }

    if (event.type === 'user.created') {
        const { id, email_addresses } = event.data

        try {
            await User.create({
                userId: id,
                email: email_addresses[0].email_address,
            })
        } catch (error) {
            console.error('❌ Error guardando usuario:', error)
            res.status(500).json({ error: 'Error guardando usuario' })
            return
        }
    }

    res.status(200).json({ received: true })
}