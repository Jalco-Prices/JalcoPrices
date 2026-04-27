'use client'

import { createContext, useContext } from 'react'
import { AnyProductType } from '@/models/ProductModel'

type ProductsContextType = {
    products: AnyProductType[]
    error: string | null
}

const ProductsContext = createContext<ProductsContextType>({
    products: [],
    error: null
})

export const ProductsProvider = (
    { products, error, children }
    :
    { products: AnyProductType[], error: string | null, children: React.ReactNode }
) => {
    return (
        <ProductsContext.Provider value={{ products, error }}>
            {children}
        </ProductsContext.Provider>
    )
}

export const useProducts = () => useContext(ProductsContext)