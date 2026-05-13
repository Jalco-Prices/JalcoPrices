// Utils
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './db/connect'

// Routes Imports
import webhookRoutes from './routes/webhooks'
import userRoutes from './routes/user'
import productRoutes from './routes/products'

// Config
dotenv.config()

const app = express()
const PORT = process.env.PORT

// Cors
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}))

// Webhook Middleware
app.use('/webhooks', express.raw({ type: 'application/json' }))

app.use(express.json())

// Routes
app.use('/webhooks', webhookRoutes)
app.use('/user', userRoutes)
app.use('/products', productRoutes)

// Start Server
const start = async (): Promise<void> => {
    try {
        await connectDB()
        app.listen(PORT, () => {
            console.log(`✅ Servidor corriendo en http://localhost:${PORT}`)
        })
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error)
        process.exit(1)
    }
}
start()