import { IconSearch, IconUserCircle, IconFilter2, IconSortDescending } from '@tabler/icons-react';


export const SearchIcon = (
    { size, stroke=2, color="black" }
    :
    { readonly size: number | string, readonly stroke?: number, readonly color?: string }
) => {
    return (
        <IconSearch size={size} stroke={stroke} color={color} />
    )
}

export const UserCircleIcon = (
    { size, stroke=2, color="black" }
    :
    { readonly size: number | string, readonly stroke?: number, readonly color?: string }
) => {
    return (
        <IconUserCircle size={size} stroke={stroke} color={color} />
    )
}

export const FilterIcon = (
    { size, stroke=2, color="black" }
    :
    { readonly size: number | string, readonly stroke?: number, readonly color?: string }
) => {
    return (
        <IconFilter2 size={size} stroke={stroke} color={color} />
    )
}

export const SortDescendingIcon = (
    { size, stroke=2, color="black" }
    :
    { readonly size: number | string, readonly stroke?: number, readonly color?: string }
) => {
    return (
        <IconSortDescending size={size} stroke={stroke} color={color} />
    )
}