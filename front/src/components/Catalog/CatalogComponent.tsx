'use client';

import "@/styles/Global/CatalogStyle.css";

// Components
import SelectFilterOrderButtonComponent from "../Buttons/SelectFilterOrderButtonComponent";
import CatalogProductsGridComponent from "./CatalogProductsGridComponent";
// Context
import { useProducts } from "@/context/ProductsContext"
// Utils
import { useState } from "react";


const filtersOptions = [
    { label: "Envase", value: "container" },
    { label: "Capacidad", value: "capacity" },
    { label: "Material", value: "material" },
    { label: "Color", value: "color" },
]

const orderOptions = [
    { label: "Precio Ascendente", value: "price-asc" },
    { label: "Precio Descendente", value: "price-desc" },
    { label: "Nombre Ascendente", value: "name-asc" },
    { label: "Nombre Descendente", value: "name-desc" },
]

export default function CatalogComponent() {
    const { products, error } = useProducts()
    const [isShowingFilters, setIsShowingFilters] = useState(false)
    const [isShowingOrderOptions, setIsShowingOrderOptions] = useState(false)
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null)
    const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

    if (error) {
        return (
            <section className="section-container">
                <p className="error-text">
                    {error}
                </p>
            </section>
        )
    }

    return (
        <section className="section-container">
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
                        setSelectedOption={setSelectedFilter}
                    />

                    {/* Order Select Button */}
                    <SelectFilterOrderButtonComponent
                        label="Ordenar"
                        iconName="sort"
                        options={orderOptions}
                        isShowingOptions={isShowingOrderOptions}
                        setIsShowingOptions={setIsShowingOrderOptions}
                        setSelectedOption={setSelectedOrder}
                    />
                </div>
            </div>

            {/* Products Grid */}
            <div className="catalog-products-grid-wrapper">
                <CatalogProductsGridComponent
                    products={products}
                    filter={selectedFilter}
                    order={selectedOrder}
                />
            </div>

            {/* Carrousel Buttons */}
        </section>
    )
}