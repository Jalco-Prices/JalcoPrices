'use server';

// Models
import { AnyProductType } from "@/models/ProductModel"

const { API_URL } = process.env

if (!API_URL) {
    throw new Error('API_URL is not defined in environment variables')
}


export const getAllProductsController = async (token: string) => {
    try {
        const response = await fetch(`${API_URL}/products`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })

        const data = await response.json()

        if (!response.ok) {
            return { error: data.error }
        }

        return { products: data }
    } catch (error) {
        console.error('getAllProducts:', (error as Error).message)
        return { error: 'Error al obtener todos los productos' }
    }
}

export const addProductController = async (token: string, newProductData: AnyProductType) => {
    try {
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newProductData)
        })

        const data = await response.json()

        if (!response.ok) {
            return { error: data.error }
        }

        return { message: data.message }
    } catch (error) {
        console.error('addProduct:', (error as Error).message)
        return { error: 'Error al agregar el producto' }
    }
}

export const updateProductController = async (token: string, productData: AnyProductType) => {
    try {
        const response = await fetch(`${API_URL}/products`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productData)
        })

        const data = await response.json()

        if (!response.ok) {
            return { error: data.error }
        }

        return { message: data.message }
    } catch (error) {
        console.error('updateProduct:', (error as Error).message)
        return { error: 'Error al actualizar el producto' }
    }
}

export const deleteProductController = async (token: string, id: string) => {
    try {
        const response = await fetch(`${API_URL}/products`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id })
        })

        const data = await response.json()

        if (!response.ok) {
            return { error: data.error }
        }

        return { message: data.message }
    } catch (error) {
        console.error('deleteProduct:', (error as Error).message)
        return { error: 'Error al eliminar el producto' }
    }
}