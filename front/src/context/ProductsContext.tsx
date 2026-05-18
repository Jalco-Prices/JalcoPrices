'use client'

// Controllers
import { addProductController, updateProductController, updateProductViewsController, deleteProductController } from "@/controllers/Global/ProductsController"
// Utils
import { createContext, useContext, useCallback, useState } from 'react'
import { AnyProductType } from '@/models/ProductModel'


type ProductsContextType = {
    products: AnyProductType[]
    addProduct: (token: string, newProductData: AnyProductType) => Promise<{ success: boolean, error: string | null }>
    editProduct: (token: string, updatedData: AnyProductType) => Promise<{ success: boolean, error: string | null }>
    updateProductViews: (token: string, id: string) => Promise<{ success: boolean, error: string | null }>
    deleteProduct: (token: string, id: string) => Promise<{ success: boolean, error: string | null }>
}

const ProductsContext = createContext<ProductsContextType>({
    products: [],
    addProduct: async () => ({ success: false, error: null }),
    editProduct: async () => ({ success: false, error: null }),
    updateProductViews: async () => ({ success: false, error: null }),
    deleteProduct: async () => ({ success: false, error: null }),
})

export const ProductsProvider = (
    { products:initialProducts, children }
    :
    { products: AnyProductType[], children: React.ReactNode }
) => {
    const [products, setProducts] = useState<AnyProductType[]>(initialProducts)

    const addProduct = useCallback(async (token: string, newProductData: AnyProductType) => {
        const result = await addProductController(token, newProductData)
        if (result.error) {
            return { success: false, error: result.error }
        }

        setProducts(prev => [...prev, { ...newProductData, _id: result.id }])

        return { success: true, error: null }
    }, [])

    const editProduct = useCallback(async (token: string, updatedData: AnyProductType) => {
        const result = await updateProductController(token, updatedData)
        if (result.error) {
            return { success: false, error: result.error }
        }

        setProducts(prev =>
            prev.map(product =>
                product._id === updatedData._id
                    ? { ...product, ...updatedData }
                    : product
            )
        )

        return { success: true, error: null }
    }, [])

    const updateProductViews = useCallback(async (token: string, id: string) => {
        const result = await updateProductViewsController(token, id)
        if (result.error) {
            return { success: false, error: result.error }
        }

        setProducts(prev =>
            prev.map(product =>
                product._id === id
                    ? { ...product, vecesVisto: product.vecesVisto + 1 }
                    : product
            )
        )

        return { success: true, error: null }
    }, [])

    const deleteProduct = useCallback(async (token: string, id: string) => {
        const result = await deleteProductController(token, id)
        if (result.error) {
            return { success: false, error: result.error }
        }

        setProducts(prev => prev.filter(product => product._id !== id))

        return { success: true, error: null }
    }, [])

    return (
        <ProductsContext.Provider value={{ products, addProduct, editProduct, updateProductViews, deleteProduct }}>
            {children}
        </ProductsContext.Provider>
    )
}

export const useProducts = () => useContext(ProductsContext)