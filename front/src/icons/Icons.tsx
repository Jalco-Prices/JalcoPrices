import { IconSearch, IconUserCircle } from '@tabler/icons-react';


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