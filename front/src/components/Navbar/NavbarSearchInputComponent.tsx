// Context
import { useProducts } from "@/context/ProductsContext";
// Icons
import { SearchIcon } from "@/icons/Icons";
import Link from "next/link";


export default function NavbarSearchInputComponent(
    { value, isSearchOpen, setSearchText, setIsSearchOpen }
    :
    { readonly value: string, readonly isSearchOpen: boolean, readonly setSearchText: (text: string) => void, readonly setIsSearchOpen: (isOpen: boolean) => void }
) {
    const { products } = useProducts();

    return (
        <section className={`search-input-container ${isSearchOpen ? 'open' : ''}`}>
            {/* Search Input Wrapper */}
            <div className="search-input-wrapper">
                {/* Search Icon */}
                <div className="search-input-icon">
                    <SearchIcon
                        size={"fill"}
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
                            <Link
                                key={product._id}
                                className="search-result-item"
                                href={`/product/${product._id}`}
                                onClick={() => setIsSearchOpen(false)}
                            >
                                {product.nombre}
                            </Link>
                        ))
                    }
                </div>
            </div>
        </section>
    )
}