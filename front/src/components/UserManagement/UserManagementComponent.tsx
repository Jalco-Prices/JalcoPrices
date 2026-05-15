'use client';

// Controllers
import { updateUserRoleController, updateUserStatusController, deleteUserController } from "@/controllers/Global/UserController";
// Models
import { UserToManageType } from "@/models/UserModel"
// Icons
import { UserSearchIcon, TrashIcon } from "@/icons/Icons"
// Utils
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { toast } from "sonner";


export default function UserManagementComponent(
    { users }
    :
    { readonly users: UserToManageType[] }
) {
    const { getToken } = useAuth()

    const [localUsers, setLocalUsers] = useState(users)
    const [searchValue, setSearchValue] = useState("")
    const [isUpdating, setIsUpdating] = useState(false)

    const filteredUsers = localUsers.filter((user) => {
        const searchLower = searchValue.toLowerCase()
        return (
            user.fullName.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower) ||
            (user.isAdmin ? "admin" : "usuario").includes(searchLower)
        )
    })

    const handleRoleChange = async (userId: string, newRole: "admin" | "user") => {
        const originalUsers = [...localUsers]
        setIsUpdating(true)
        const toastId = toast.loading("Actualizando rol...")
        setLocalUsers((prevUsers) =>
            prevUsers.map((user) =>
                user._id === userId ? { ...user, isAdmin: newRole === "admin" } : user
            )
        )

        const token = await getToken()
        if (!token) {
            toast.error("Usuario no autenticado", { id: toastId })
            setLocalUsers(originalUsers)
            setIsUpdating(false)
            return
        }

        const result = await updateUserRoleController(token, userId, newRole)
        if (result.error) {
            toast.error(result.error, { id: toastId })
            setLocalUsers(originalUsers)
            setIsUpdating(false)
            return
        }

        toast.success("Rol actualizado", { id: toastId })
        setIsUpdating(false)
    }

    const handleStatusChange = async (userId: string, newStatus: boolean) => {
        const originalUsers = [...localUsers]
        setIsUpdating(true)
        const toastId = toast.loading("Actualizando estado...")
        setLocalUsers((prevUsers) =>
            prevUsers.map((user) =>
                user._id === userId ? { ...user, isDisabled: newStatus } : user
            )
        )

        const token = await getToken()
        if (!token) {
            toast.error("Usuario no autenticado", { id: toastId })
            setLocalUsers(originalUsers)
            setIsUpdating(false)
            return
        }

        const result = await updateUserStatusController(token, userId, newStatus)
        if (result.error) {
            toast.error(result.error, { id: toastId })
            setLocalUsers(originalUsers)
            setIsUpdating(false)
            return
        }

        toast.success("Estado actualizado", { id: toastId })
        setIsUpdating(false)
    }

    const handleDeleteUser = async (userId: string) => {
        const originalUsers = [...localUsers]
        setIsUpdating(true)
        const toastId = toast.loading("Eliminando usuario...")
        setLocalUsers((prevUsers) =>
            prevUsers.filter((user) => user._id !== userId)
        )

        const token = await getToken()
        if (!token) {
            toast.error("Usuario no autenticado", { id: toastId })
            setLocalUsers(originalUsers)
            setIsUpdating(false)
            return
        }

        const result = await deleteUserController(token, userId)
        if (result.error) {
            toast.error(result.error, { id: toastId })
            setLocalUsers(originalUsers)
            setIsUpdating(false)
            return
        }

        toast.success("Usuario eliminado", { id: toastId })
        setIsUpdating(false)
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
                        <div className="pl-2">
                            <UserSearchIcon size={19} color="#666" />
                        </div>

                        {/* User Search Input */}
                        <input
                            type="text"
                            placeholder="Filtrar por nombre, correo o rol..."
                            className="w-full md:w-96 px-2 py-2 text-body-sm focus:outline-none"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                    </div>

                    {/* User Count */}
                    <p className="text-body-sm text-on-surface-variant">
                        Mostrando {filteredUsers.length} {filteredUsers.length === 1 ? "usuario" : "usuarios"}
                    </p>
                </div>

                {filteredUsers.length == 0
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
                                    {filteredUsers.map((user) => (
                                        <tr
                                            key={user._id}
                                            className="hover:bg-surface-container-low transition-colors"
                                        >
                                            {/* User Information */}
                                            <td className="px-lg py-4">
                                                <div className="flex items-center gap-md">
                                                    <div className="overflow-hidden relative w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed font-bold">
                                                        {user.imageUrl
                                                            ?   <Image
                                                                    src={user.imageUrl}
                                                                    alt={user.fullName}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            :   user.fullName.split(" ").map((namePart) => namePart[0]).join("").toUpperCase()
                                                        }
                                                    </div>

                                                    <div>
                                                        {user.fullName && <p className="font-body-md font-semibold text-on-surface">{user.fullName}</p>}
                                                        <p className="text-body-sm text-on-surface-variant">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* User Role */}
                                            <td className="px-lg py-4">
                                                <select
                                                    disabled={isUpdating}
                                                    value={user.isAdmin ? "admin" : "user"}
                                                    className="rounded-md text-body-sm py-1 pl-2 pr-8 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:ring-secondary disabled:bg-gray-100 border-outline-variant bg-white border"
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
                                                        disabled={isUpdating}
                                                        className="relative inline-flex items-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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

                                                    <span className={`text-body-sm font-medium transition-opacity ${user.isDisabled ? 'text-on-primary-container' : 'text-secondary'} ${isUpdating ? 'opacity-50' : ''}`}>
                                                        {user.isDisabled ? "Inactivo" : "Activo"}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Action Buttons */}
                                            <td className="px-lg py-4 text-right">
                                                <button
                                                    disabled={isUpdating}
                                                    className="p-2 rounded-lg transition-colors cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 disabled:hover:bg-transparent text-error hover:bg-error-container"
                                                    onClick={() => handleDeleteUser(user.userId!)}
                                                >
                                                    <TrashIcon size={24} color="#ba1a1a" />
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