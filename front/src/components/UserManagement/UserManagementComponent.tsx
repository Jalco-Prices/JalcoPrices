'use client';

// Components
import ErrorComponent from "../Global/ErrorComponent";
// Models
import { UserToManageType } from "@/models/UserModel"
// Context
import { useUser } from "@/context/UserContext";
// Icons
import { UserSearchIcon, TrashIcon } from "@/icons/Icons"


export default function UserManagementComponent(
    { users }
    :
    { readonly users: UserToManageType[] }
) {
    const { isAdmin } = useUser()

    const handleRoleChange = (userId: string, newRole: "admin" | "user") => {
        console.log("updating-role", userId, newRole)
    }

    const handleStatusChange = (userId: string, newStatus: boolean) => {
        console.log("updating-status", userId, newStatus)
    }

    const handleDeleteUser = (userId: string) => {
        console.log("deleting-user", userId)
    }

    // No admin access State
    if (!isAdmin) {
        return (
            <ErrorComponent message="No tienes permiso para acceder a esta página" />
        )
    }

    return (
        <section className="section-container">
            {/* Section Title */}
            <h1 className="section-title-label">Gestión de Usuarios</h1>

            {/* Users Container */}
            <div className="overflow-hidden w-full border rounded-xl border-outline-variant bg-white">
                {/* Top Users Container */}
                <div className="flex flex-col p-5 gap-4 md:flex-row md:justify-between md:items-center md:gap-0 border-b border-outline-variant">
                    {/* User Search Input Container */}
                    <div className="w-full md:w-fit flex items-center border rounded-md border-outline-variant">
                        {/* Icon */}
                        <div className="h-4.75 pl-2">
                            <UserSearchIcon size={"fill"} color="#666" />
                        </div>

                        {/* User Search Input */}
                        <input
                            type="text"
                            placeholder="Filtrar por nombre, correo o rol..."
                            className="w-full md:w-96 px-2 py-2 text-body-sm focus:outline-none"
                        />
                    </div>

                    {/* User Count */}
                    <p className="text-body-sm text-on-surface-variant">
                        Mostrando {users.length} {users.length === 1 ? "usuario" : "usuarios"}
                    </p>
                </div>

                {users.length == 0
                    ?   // Empty State
                        <div className="p-5">
                            <p className="error-text">No hay usuarios para mostrar</p>
                        </div>
                    :   // Users List Container
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-outline-variant bg-surface-container-low">
                                        <th className="px-lg py-4 font-inter text-label-caps text-on-surface-variant uppercase tracking-wider">Usuario</th>
                                        <th className="px-lg py-4 font-inter text-label-caps text-on-surface-variant uppercase tracking-wider">Rol</th>
                                        <th className="px-lg py-4 font-inter text-label-caps text-on-surface-variant uppercase tracking-wider">Estado</th>
                                        <th className="px-lg py-4 font-inter text-label-caps text-on-surface-variant uppercase tracking-wider text-right">Acciones</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-outline-variant">
                                    {users.map((user) => (
                                        <tr
                                            key={user._id}
                                            className="hover:bg-surface-container-low transition-colors group"
                                        >
                                            {/* User Information */}
                                            <td className="px-lg py-4">
                                                <div className="flex items-center gap-md">
                                                    <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed font-bold">
                                                        {user.fullName.split(" ").map((namePart) => namePart[0]).join("").toUpperCase()}
                                                    </div>

                                                    <div>
                                                        <p className="font-body-md font-semibold text-on-surface">{user.fullName}</p>
                                                        <p className="text-body-sm text-on-surface-variant">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* User Role */}
                                            <td className="px-lg py-4">
                                                <select
                                                    value={user.isAdmin ? "admin" : "user"}
                                                    className="bg-white border border-outline-variant rounded-md text-body-sm py-1 pl-2 pr-8 focus:ring-secondary cursor-pointer"
                                                    onChange={(e) => handleRoleChange(user._id!, e.target.value as "admin" | "user") }
                                                >
                                                    <option value={"admin"} >Admin</option>
                                                    <option value={"user"} >Usuario</option>
                                                </select>
                                            </td>

                                            {/* User Status */}
                                            <td className="px-lg py-4">
                                                <div className="flex items-center gap-md">
                                                    <button
                                                        className="relative inline-flex items-center cursor-pointer"
                                                        onClick={() => handleStatusChange(user._id!, !user.isDisabled) }
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={!user.isDisabled}
                                                            className="sr-only peer"
                                                            readOnly
                                                        />
                                                        <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary" />
                                                    </button>

                                                    <span className="text-body-sm font-medium text-secondary">{user.isDisabled ? "Inactivo" : "Activo"}</span>
                                                </div>
                                            </td>

                                            {/* Action Buttons */}
                                            <td className="px-lg py-4 text-right">
                                                <button
                                                    className="p-2 rounded-lg transition-colors cursor-pointer text-error hover:bg-error-container"
                                                    onClick={() => handleDeleteUser(user._id!)}
                                                >
                                                    <div className="h-6">
                                                        <TrashIcon size={"fill"} color="#ba1a1a" />
                                                    </div>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                }
            </div>
        </section>
    )
}