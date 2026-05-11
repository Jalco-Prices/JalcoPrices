

export type UserType = {
    _id?: string
    userId: string
    email: string
    isAdmin: boolean
    isDisabled: boolean
    createdAt?: string
    updatedAt?: string
}

export type UserToManageType = UserType & {
    fullName: string
}