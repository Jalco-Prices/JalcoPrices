// Components
import UserManagementComponent from "@/components/UserManagement/UserManagementComponent"
// Models
import { UserToManageType } from "@/models/UserModel"


export default async function UserManagementPage() {
    const users: UserToManageType[] = [
        {
            _id: "1",
            userId: "clerk_user_1",
            fullName: "Julian Sterling",
            email: "j.sterling@jalcoprices.com",
            isAdmin: false,
            isDisabled: false,
            createdAt: "2024-01-01T00:00:00.000Z",
            updatedAt: "2024-01-01T00:00:00.000Z"
        }
    ]

    return (
        <main className="main-container">
            <UserManagementComponent users={users} />
        </main>
    )
}