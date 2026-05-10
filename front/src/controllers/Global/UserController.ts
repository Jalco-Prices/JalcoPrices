'use server';

const { API_URL } = process.env

if (!API_URL) {
    throw new Error('API_URL is not defined in environment variables')
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