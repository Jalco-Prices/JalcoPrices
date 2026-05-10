'use client'

// Utils
import { createContext, useContext } from 'react'


type UserContextType = {
    isAdmin: boolean
}

const UserContext = createContext<UserContextType>({
    isAdmin: false
})

export const UserProvider = (
    { isAdmin, children }
    :
    { isAdmin: boolean, children: React.ReactNode }
) => {

    return (
        <UserContext.Provider value={{ isAdmin }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext)