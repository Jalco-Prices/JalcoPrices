import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const migrate = async (): Promise<void> => {
    const uri = process.env.MONGODB_URI
    if (!uri) throw new Error('MONGODB_URI no está definida en .env')

    // Conexión a la DB origen (JalcoPrices)
    const sourceConn = await mongoose.createConnection(uri.replace('/db?', '/JalcoPrices?')).asPromise()
    // Conexión a la DB destino (db)
    const targetConn = await mongoose.createConnection(uri).asPromise()

    console.log('✅ Conexiones establecidas')

    const sourceCollection = sourceConn.collection('products')
    const targetCollection = targetConn.collection('products')

    const products = await sourceCollection.find({}).toArray()
    console.log(`📦 ${products.length} productos encontrados en JalcoPrices`)

    if (products.length > 0) {
        await targetCollection.insertMany(products, { ordered: false })
        console.log(`✅ ${products.length} productos copiados a db`)
    }

    await sourceConn.close()
    await targetConn.close()
    console.log('✅ Conexiones cerradas')
}

migrate().catch((error) => {
    console.error('❌ Error en migración:', error)
    process.exit(1)
})