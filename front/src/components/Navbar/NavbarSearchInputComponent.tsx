// Context
import { useProducts } from "@/context/ProductsContext";
// Icons
import { SearchIcon } from "@/icons/Icons";
// Utils
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";


export default function NavbarSearchInputComponent(
    { value, isSearchOpen, setSearchText, setIsSearchOpen }
    :
    { readonly value: string, readonly isSearchOpen: boolean, readonly setSearchText: (text: string) => void, readonly setIsSearchOpen: (isOpen: boolean) => void }
) {
    const { products, updateProductViews } = useProducts();
    const { getToken } = useAuth();
    const router = useRouter();

    const handleProductClick = async (id: string) => {
        router.push(`/product/${id}`)
        const token = await getToken()
        if (!token) {
            console.error("No se pudo obtener el token de autenticación.")
            return
        }
        await updateProductViews(token, id)
    }

    return (
        <section className={`search-input-container ${isSearchOpen ? 'open' : ''}`}>
            {/* Search Input Wrapper */}
            <div className="search-input-wrapper">
                {/* Search Icon */}
                <div className="search-input-icon">
                    <SearchIcon
                        size={20}
                        color="#76777D"
                    />
                </div>

                {/* Search Input */}
                <input
                    id="search-input-id"
                    type="text"
                    className="search-input"
                    placeholder="Buscar productos..."
                    autoFocus={true}
                    value={value}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Escape") {
                            setIsSearchOpen(false);
                        }
                    }}
                />
            </div>

            {/* Search Results Container */}
            <div className={`search-results-wrapper ${value ? 'open' : ''}`}>
                <div className="search-results-container">
                    {products
                        .filter(product => product.nombre.toLowerCase().includes(value.toLowerCase()))
                        .map((product) => (
                            <button
                                key={product._id}
                                className="search-result-item"
                                onClick={() => {
                                    setIsSearchOpen(false)
                                    handleProductClick(product._id!)
                                }}
                            >
                                {product.nombre}
                            </button>
                        ))
                    }
                </div>
            </div>
        </section>
    )
}