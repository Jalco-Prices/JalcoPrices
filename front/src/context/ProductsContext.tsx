'use client'

// Controllers
import { updateProduct } from "@/controllers/Global/ProductsController"
// Utils
import { createContext, useContext, useCallback, useState } from 'react'
import { AnyProductType } from '@/models/ProductModel'


type ProductsContextType = {
    products: AnyProductType[]
    editProduct: (token: string, updatedData: AnyProductType) => Promise<{ success: boolean, error: string | null }>
}

const ProductsContext = createContext<ProductsContextType>({
    products: [],
    editProduct: async () => ({ success: false, error: null })
})

export const ProductsProvider = (
    { products:initialProducts, children }
    :
    { products: AnyProductType[], children: React.ReactNode }
) => {
    const [products, setProducts] = useState<AnyProductType[]>(initialProducts)

    const editProduct = useCallback(async (token: string, updatedData: AnyProductType) => {
        const result = await updateProduct(token, updatedData)
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

    return (
        <ProductsContext.Provider value={{ products, editProduct }}>
            {children}
        </ProductsContext.Provider>
    )
}

export const useProducts = () => useContext(ProductsContext)