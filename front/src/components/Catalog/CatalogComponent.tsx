'use client';

import "@/styles/Global/CatalogStyle.css";

// Components
import SelectFilterOrderButtonComponent from "../Buttons/SelectFilterOrderButtonComponent";
import CatalogProductsGridComponent from "./CatalogProductsGridComponent";
import PaginationActionsComponent from "../Buttons/PaginationActionsComponent";
// Context
import { useProducts } from "@/context/ProductsContext"
// Utils
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useProductsPerPage } from "@/hooks/useProductsPerPage";


const orderOptions = [
    { label: "Ordenar", value: "all" },
    { label: "Nombre Ascendente", value: "name-asc" },
    { label: "Nombre Descendente", value: "name-desc" },
    { label: "Precio Ascendente", value: "price-asc" },
    { label: "Precio Descendente", value: "price-desc" },
]

export default function CatalogComponent(
    { filterParam, sortParam, pageParam }
    :
    { readonly filterParam?: string; readonly sortParam?: string; readonly pageParam?: string }
) {
    const { products: allProducts } = useProducts()
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()
    
    const [isShowingFilters, setIsShowingFilters] = useState(false)
    const [isShowingOrderOptions, setIsShowingOrderOptions] = useState(false)
    const [selectedFilter, setSelectedFilter] = useState<string | null>(filterParam || null)
    const [selectedOrder, setSelectedOrder] = useState<string | null>(sortParam || null)
    const [currentPage, setCurrentPage] = useState(pageParam ? Number.parseInt(pageParam, 10) : 1)

    const paginationRef = useRef<HTMLDivElement>(null)

    const filtersOptions = [
        { label: "Filtrar", value: "all" },
        ...Array.from(
            new Set(allProducts.map((product) => product.categoria.split(" ")[0]))
        ).map((categoria) => ({
            label: categoria,
            value: categoria,
        })),
    ];

    const sortedProducts = [...allProducts].sort((a, b) => {
            if (selectedOrder === "name-asc") {
                return a.nombre.localeCompare(b.nombre)
            } else if (selectedOrder === "name-desc") {
                return b.nombre.localeCompare(a.nombre)
            } else if (selectedOrder === "price-asc") {
                return a.precioMenudeo - b.precioMenudeo
            } else if (selectedOrder === "price-desc") {
                return b.precioMenudeo - a.precioMenudeo
            }
            return b.vecesVisto - a.vecesVisto
        })

    const products = selectedFilter && selectedFilter !== "all"
        ? sortedProducts.filter((product) => {
            return product.categoria.includes(selectedFilter)
        })
        : sortedProducts

    const productsPerPage = useProductsPerPage()
    const totalPages = Math.ceil(products.length / productsPerPage)
    const paginatedProducts = products.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    )

    const handleFilterChange = (filter: string | null) => {
        setSelectedFilter(filter)
        setCurrentPage(1)
    }

    const handleOrderChange = (order: string | null) => {
        setSelectedOrder(order)
        setCurrentPage(1)
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        setTimeout(() => {
            paginationRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "end",
            })
        })
    }

    // Update URL Params
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString())
        if (selectedFilter) {
            params.set('filter', selectedFilter)
        }
        if (selectedOrder) {
            params.set('sort', selectedOrder)
        }
        params.set('page', currentPage.toString())
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFilter, selectedOrder, currentPage]);

    return (
        <section ref={paginationRef} className="section-container">
            {/* Title */}
            <h1 className="section-title-label">
                Catálogo de Productos
            </h1>

            {/* Amount products & Selects Wrapper */}
            <div className="catalog-amount-products-selects-wrapper">
                <p className="catalog-amount-products">
                    Mostrando: {products.length} {products.length === 1 ? "producto" : "productos"}.
                </p>

                {/* Selects Filter & Order Container */}
                {paginatedProducts.length > 0 &&
                    <div className="catalog-selects-container">
                        {/* Filter Select Button */}
                        <SelectFilterOrderButtonComponent
                            label={filtersOptions.find((f) => f.value === selectedFilter)?.label || "Filtrar"}
                            iconName="filter"
                            options={filtersOptions}
                            isShowingOptions={isShowingFilters}
                            setIsShowingOptions={setIsShowingFilters}
                            setSelectedOption={handleFilterChange}
                        />

                        {/* Order Select Button */}
                        <SelectFilterOrderButtonComponent
                            label={orderOptions.find((o) => o.value === selectedOrder)?.label || "Ordenar"}
                            iconName="sort"
                            options={orderOptions}
                            isShowingOptions={isShowingOrderOptions}
                            setIsShowingOptions={setIsShowingOrderOptions}
                            setSelectedOption={handleOrderChange}
                        />
                    </div>
                }
            </div>

            {/* Products Grid */}
            <div className="catalog-products-grid-wrapper">
                <CatalogProductsGridComponent
                    products={paginatedProducts}
                />
            </div>

            {/* Pagination Actions */}
            <div className="catalog-pagination-actions-wrapper">
                {paginatedProducts.length > 0 &&
                    <PaginationActionsComponent
                        currentPage={currentPage}
                        totalPages={totalPages}
                        setCurrentPage={handlePageChange}
                    />
                }
            </div>
        </section>
    )
}