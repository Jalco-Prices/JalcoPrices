'use client';

import "@/styles/Global/NavbarStyle.css";

// Components
import NavbarSearchInputComponent from "./NavbarSearchInputComponent";
// Texts
import { menuContentNavLinks } from "@/texts/Navbar";
// Context
import { useUser as useUserLocal } from "@/context/UserContext";
// Icons
import { SearchIcon } from "@/icons/Icons";
// Utils
import { useUser, UserButton } from '@clerk/nextjs'
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";


export default function NavbarComponent() {
    const { isAdmin } = useUserLocal();
    const { user } = useUser();
    const router = useRouter();
    const pathname = usePathname();
    const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>("");

    return (
        <header className='navbar-main-container'>
            {/* Logo Label */}
            <button
                className='navbar-title-label'
                onClick={() => router.push("/")}
            >
                Jalco Prices
            </button>

            {/* Right Wrapper */}
            {user &&
                <div className="navbar-right-wrapper">
                    {/* Search Icon */}
                    <button
                        className="navbar-search-button"
                        onClick={() => {
                            setIsSearchOpen(!isSearchOpen);
                            if (!isSearchOpen) {
                                setTimeout(() => {
                                    const searchInput = document.getElementById("search-input-id") as HTMLInputElement;
                                    if (searchInput) {
                                        searchInput.focus();
                                    }
                                }, 100);
                            }
                        }}
                    >
                        <SearchIcon
                            size={26}
                        />
                    </button>

                    {/* User Profile Button */}
                    <UserButton />

                    {/* Menu Button */}
                    <button
                        className={`menu-button ${isMenuOpen ? 'open' : ''}`}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <span className="menu-button-bar menu-button-bar1" />
                        <span className="menu-button-bar menu-button-bar2" />
                        <span className="menu-button-bar menu-button-bar3" />
                    </button>
                </div>
            }

            {/* Search Input Container */}
            <NavbarSearchInputComponent
                value={searchText}
                isSearchOpen={isSearchOpen}
                setSearchText={setSearchText}
                setIsSearchOpen={setIsSearchOpen}
            />

            {/* Menu Content Container */}
            <div className={`menu-content-container ${isMenuOpen ? 'open' : ''}`}>
                {menuContentNavLinks
                    .filter(link => !link.justAdminView || (link.justAdminView && isAdmin))
                    .map((link) => (
                        <button
                            key={link.value}
                            className={`menu-content-nav-link ${pathname === link.href || pathname.startsWith(link.href + "/") ? 'selected' : ''}`}
                            onClick={() => {
                                setIsMenuOpen(false);
                                router.push(link.href);
                            }}
                        >
                            {link.label}
                        </button>
                    ))
                }
            </div>

            {/* Disable Overlay */}
            <button
                style={{ display: isMenuOpen || isSearchOpen ? 'block' : 'none' }}
                className={`disable-overlay ${isMenuOpen || isSearchOpen ? 'open' : ''}`}
                onClick={() => {
                    setIsSearchOpen(false);
                    setIsMenuOpen(false);
                }}
            />
        </header>
    )
}