'use client';

import "@/styles/Global/CatalogStyle.css";

// Components
import SelectFilterOrderButtonComponent from "../Buttons/SelectFilterOrderButtonComponent";
import CatalogProductsGridComponent from "./CatalogProductsGridComponent";
import PaginationActionsComponent from "../Buttons/PaginationActionsComponent";
// Context
import { useProducts } from "@/context/ProductsContext"
// Utils
import { useState, useRef } from "react";


const filtersOptions = [
    { label: "Envase", value: "container" },
    { label: "Capacidad", value: "capacity" },
]

const orderOptions = [
    { label: "Precio Ascendente", value: "price-asc" },
    { label: "Precio Descendente", value: "price-desc" },
    { label: "Nombre Ascendente", value: "name-asc" },
    { label: "Nombre Descendente", value: "name-desc" },
]

export default function CatalogComponent() {
    const { products } = useProducts()
    const [isShowingFilters, setIsShowingFilters] = useState(false)
    const [isShowingOrderOptions, setIsShowingOrderOptions] = useState(false)
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null)
    const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)

    const paginationRef = useRef<HTMLDivElement>(null)

    const PRODUCTS_PER_PAGE = 8
    const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE)
    const paginatedProducts = products.slice(
        (currentPage - 1) * PRODUCTS_PER_PAGE,
        currentPage * PRODUCTS_PER_PAGE
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
                <div className="catalog-selects-container">
                    {/* Filter Select Button */}
                    <SelectFilterOrderButtonComponent
                        label="Filtrar"
                        iconName="filter"
                        options={filtersOptions}
                        isShowingOptions={isShowingFilters}
                        setIsShowingOptions={setIsShowingFilters}
                        setSelectedOption={handleFilterChange}
                    />

                    {/* Order Select Button */}
                    <SelectFilterOrderButtonComponent
                        label="Ordenar"
                        iconName="sort"
                        options={orderOptions}
                        isShowingOptions={isShowingOrderOptions}
                        setIsShowingOptions={setIsShowingOrderOptions}
                        setSelectedOption={handleOrderChange}
                    />
                </div>
            </div>

            {/* Products Grid */}
            <div className="catalog-products-grid-wrapper">
                <CatalogProductsGridComponent
                    products={paginatedProducts}
                    filter={selectedFilter}
                    order={selectedOrder}
                />
            </div>

            {/* Pagination Actions */}
            <div
                
                className="catalog-pagination-actions-wrapper"
            >
                <PaginationActionsComponent
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={handlePageChange}
                />
            </div>
        </section>
    )
}