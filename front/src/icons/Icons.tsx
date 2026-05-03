import {
    IconSearch, IconUserCircle, IconFilter2, IconSortDescending, IconChevronLeft, IconChevronRight, IconArrowLeft,
    IconBarcode, IconRosetteDiscountCheck, IconInfoCircle, IconCash
} from '@tabler/icons-react';


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

export const ArrowLeftIcon = (
    { size, stroke=2, color="black" }
    :
    { readonly size: number | string, readonly stroke?: number, readonly color?: string }
) => {
    return (
        <IconChevronLeft size={size} stroke={stroke} color={color} />
    )
}

export const ArrowRightIcon = (
    { size, stroke=2, color="black" }
    :
    { readonly size: number | string, readonly stroke?: number, readonly color?: string }
) => {
    return (
        <IconChevronRight size={size} stroke={stroke} color={color} />
    )
}

export const ArrowLeftIconSimple = (
    { size, stroke=2, color="black" }
    :
    { readonly size: number | string, readonly stroke?: number, readonly color?: string }
) => {
    return (
        <IconArrowLeft size={size} stroke={stroke} color={color} />
    )
}

export const BarcodeIcon = (
    { size, stroke=2, color="black" }
    :
    { readonly size: number | string, readonly stroke?: number, readonly color?: string }
) => {
    return (
        <IconBarcode size={size} stroke={stroke} color={color} />
    )
}

export const RosetteDiscountCheckIcon = (
    { size, stroke=2, color="black" }
    :
    { readonly size: number | string, readonly stroke?: number, readonly color?: string }
) => {
    return (
        <IconRosetteDiscountCheck size={size} stroke={stroke} color={color} />
    )
}

export const InfoCircleIcon = (
    { size, stroke=2, color="black" }
    :
    { readonly size: number | string, readonly stroke?: number, readonly color?: string }
) => {
    return (
        <IconInfoCircle size={size} stroke={stroke} color={color} />
    )
}

export const CashIcon = (
    { size, stroke=2, color="black" }
    :
    { readonly size: number | string, readonly stroke?: number, readonly color?: string }
) => {
    return (
        <IconCash size={size} stroke={stroke} color={color} />
    )
}