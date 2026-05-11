// Components
import ErrorComponent from "@/components/Global/ErrorComponent"
import UserManagementComponent from "@/components/UserManagement/UserManagementComponent"
// Controllers
import { getAllUsersController } from "@/controllers/Global/UserController"
// Models
import { UserType, UserToManageType } from "@/models/UserModel"
// Utils
import { auth, clerkClient } from '@clerk/nextjs/server'


export default async function UserManagementPage() {
    let error: string | null = null
    let users: UserToManageType[] = []

    const { getToken } = await auth()
    const token = await getToken()

    if (token) {
        // Get all users from DB
        const dbUsersResult = await getAllUsersController(token)

        if (!dbUsersResult.error) {
            // Fetch all users from Clerk
            const client = await clerkClient()
            const { data: clerkUsers } = await client.users.getUserList()

            // Generate a map of Clerk userId to fullName for easy lookup
            const clerkUserMap = new Map(
                clerkUsers.map((clerkUser) => [
                    clerkUser.id,
                    {
                        fullName:
                            [clerkUser.firstName, clerkUser.lastName]
                                .filter(Boolean)
                                .join(" ") || clerkUser.username || "Sin nombre",
                        imageUrl: clerkUser.imageUrl,
                    },
                ])
            )

            // Merge both User data sources
            users = dbUsersResult.users.map((dbUser: UserType) => ({
                ...dbUser,
                fullName: clerkUserMap.get(dbUser.userId)?.fullName ?? "Sin nombre",
                imageUrl: clerkUserMap.get(dbUser.userId)?.imageUrl ?? "",
            }))
        } else {
            error = dbUsersResult.error
        }
    } else {
        error = "Usuario no autenticado"
    }

    if (error) {
        return (
            <main className="main-container">
                <ErrorComponent message={
                    error === "Usuario sin permisos"
                        ? "No tienes permiso para acceder a esta página"
                        : error
                } />
            </main>
        )
    }

    return (
        <main className="main-container">
            <UserManagementComponent users={users} />
        </main>
    )
}