'use server';

const { API_URL } = process.env

if (!API_URL) {
    throw new Error('API_URL is not defined in environment variables')
}

export const getAllUsersController = async (token: string) => {
    try {
        const response = await fetch(`${API_URL}/user/all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })

        const data = await response.json()

        if (!response.ok) {
            return { error: data.error }
        }

        return { users: data.users }
    } catch (error) {
        console.error('getAllUsersController:', (error as Error).message)
        return { error: 'Error al obtener los usuarios' }
    }
}

export const getUserIsAdminController = async (token: string) => {
    try {
        const response = await fetch(`${API_URL}/user/is-admin`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })

        const data = await response.json()

        if (!response.ok) {
            return { error: data.error }
        }

        return { isAdmin: data.isAdmin }
    } catch (error) {
        console.error('getUserIsAdminController:', (error as Error).message)
        return { error: 'Error al obtener el estado de administrador del usuario' }
    }
}

export const updateUserRoleController = async (token: string, userId: string, newRole: "admin" | "user") => {
    try {
        const response = await fetch(`${API_URL}/user/update-role`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userId, newRole })
        })

        const data = await response.json()

        if (!response.ok) {
            return { error: data.error }
        }

        return { success: true }
    } catch (error) {
        console.error('updateUserRoleController:', (error as Error).message)
        return { error: 'Error al actualizar el rol del usuario' }
    }
}

export const updateUserStatusController = async (token: string, userId: string, newStatus: boolean) => {
    try {
        const response = await fetch(`${API_URL}/user/update-status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userId, newStatus })
        })

        const data = await response.json()

        if (!response.ok) {
            return { error: data.error }
        }

        return { success: true }
    } catch (error) {
        console.error('updateUserStatusController:', (error as Error).message)
        return { error: 'Error al actualizar el estado del usuario' }
    }
}

export const deleteUserController = async (token: string, userId: string) => {
    try {
        const response = await fetch(`${API_URL}/user/delete/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })

        const data = await response.json()

        if (!response.ok) {
            return { error: data.error }
        }

        return { success: true }
    } catch (error) {
        console.error('deleteUserController:', (error as Error).message)
        return { error: 'Error al eliminar el usuario' }
    }
}
