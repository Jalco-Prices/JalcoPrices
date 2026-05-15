import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const migrate = async (): Promise<void> => {
    const sourceUri = process.env.MONGODB_URI_PRODUCTION
    const targetUri = process.env.MONGODB_URI_DEVELOPMENT

    if (!sourceUri) throw new Error('MONGODB_URI_PRODUCTION no está definida en .env')
    if (!targetUri) throw new Error('MONGODB_URI_DEVELOPMENT no está definida en .env')

    // Conexión al cluster origen (JalcoPrices - Production)
    const sourceConn = await mongoose.createConnection(sourceUri).asPromise()
    // Conexión al cluster destino (Development - Development)
    const targetConn = await mongoose.createConnection(targetUri).asPromise()

    console.log('✅ Conexiones establecidas')

    const sourceCollection = sourceConn.collection('products')
    const targetCollection = targetConn.collection('products')

    const products = await sourceCollection.find({}).toArray()
    console.log(`📦 ${products.length} productos encontrados en Production (JalcoPrices/db)`)

    if (products.length > 0) {
        await targetCollection.insertMany(products, { ordered: false })
        console.log(`✅ ${products.length} productos copiados a Development (Development/db)`)
    } else {
        console.log('⚠️  No se encontraron productos en el origen')
    }

    await sourceConn.close()
    await targetConn.close()
    console.log('✅ Conexiones cerradas')
}

migrate().catch((error) => {
    console.error('❌ Error en migración:', error)
    process.exit(1)
})