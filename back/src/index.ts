// Utils
import express from 'express'
import dotenv from 'dotenv'
import connectDB from './db/connect'

// Routes Imports
import webhookRoutes from './routes/webhooks'
import productRoutes from './routes/products'

// Config
dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(express.json())

// Routes
app.use('/webhooks', webhookRoutes)
app.use('/products', productRoutes)

// Start Server
const start = async (): Promise<void> => {
    await connectDB()
    app.listen(PORT, () => {
        console.log(`✅ Servidor corriendo en http://localhost:${PORT}`)
    })
}

start()