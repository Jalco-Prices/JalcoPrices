// Components
import ErrorComponent from "@/components/Global/ErrorComponent"
import CreateProductComponent from "@/components/CreateProduct/CreateProductComponent"
// Controllers
import { getUserIsAdminController } from "@/controllers/Global/UserController"
// Utils
import { auth } from '@clerk/nextjs/server'


export default async function CreateProductPage() {
    let isAdmin: boolean = false
    let error: string | null = null

    const { getToken } = await auth()
    const token = await getToken()

    if (token) {
        const result = await getUserIsAdminController(token)
        if (result.error) {
            error = result.error
        }
        isAdmin = result.isAdmin
    }

    if (error) {
        return (
            <ErrorComponent message={error} />
        )
    }

    if (!isAdmin) {
        return (
            <ErrorComponent message="No tienes permiso para acceder a esta página" />
        )
    }

    return (
        <main className="main-container">
            <CreateProductComponent />
        </main>
    )
}