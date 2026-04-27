const { API_URL } = process.env


export const getAllProducts = async (token: string) => {
    try {
        const response = await fetch(`${API_URL}/products`, {
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

        return { products: data }
    } catch (error) {
        console.error('Error fetching products:', error)
        return { error: 'Error fetching products' }
    }
}