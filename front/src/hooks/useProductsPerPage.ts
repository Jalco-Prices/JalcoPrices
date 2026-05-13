import { useState, useEffect } from "react"

const BREAKPOINTS = {
    sm: 640,
    lg: 1024,
    xl: 1280,
} as const

function getProductsPerPage(width: number): number {
    if (width >= BREAKPOINTS.xl) return 8
    if (width >= BREAKPOINTS.lg) return 6
    if (width >= BREAKPOINTS.sm) return 4
    return 3
}

export function useProductsPerPage(): number {
    const [productsPerPage, setProductsPerPage] = useState<number>(8)

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setProductsPerPage(getProductsPerPage(window.innerWidth))

        const observer = new ResizeObserver(([entry]) => {
            setProductsPerPage(getProductsPerPage(entry.contentRect.width))
        })

        observer.observe(document.documentElement)

        return () => observer.disconnect()
    }, [])

    return productsPerPage
}