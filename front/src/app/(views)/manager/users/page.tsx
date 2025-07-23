/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  fetchAllUsers,
  updateUserRole,
  deleteUser as deleteUserService,
} from "@/services/user.service";
import { IUser, UserRole } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { Loader2, PencilIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";

const roles = [
  { value: UserRole.ADMIN, label: "Admin" },
  { value: UserRole.STUDENT, label: "Estudiante" },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<IUser | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleError = (error: any) => {
    const errorMessage =
      error.error || error.message || "Ocurrió un error inesperado";
    toast.error(errorMessage);
  };

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetchAllUsers();
    if (res.success && "users" in res) {
      setUsers(res.users);
    } else {
      handleError(res);
    }
    setLoading(false);
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    const res = await updateUserRole(userId, newRole as UserRole);
    if (res.success) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, role: newRole as IUser["role"] }
            : user
        )
      );
      setEditingUser(null);
    } else {
      handleError(res);
    }
  };

  // 2. confirma y ejecuta la eliminación
  const handleConfirmDelete = async () => {
    if (!deletingUser) return;

    const res = await deleteUserService(deletingUser.id);
    if (res.success) {
      setUsers(users.filter((u) => u.id !== deletingUser.id));
      setDeletingUser(null);
    } else {
      handleError(res);
      setDeletingUser(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 px-4">
        <h1 className="font-semibold text-gray-900">Gestión de Usuarios</h1>
      </header>

      <main className="flex-1 overflow-auto p-6 bg-gradient-to-b from-[#f9f7f5] to-white">
        {loading ? (
          <div className="flex-1 flex items-center justify-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                  <th className="p-3">Usuario</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">País</th>
                  <th className="p-3">Rol</th>
                  <th className="p-3">Teléfono</th>
                  <th className="p-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t text-sm">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <Image
                          src={user.profile_image_url || "/default-avatar.jpg"}
                          alt={`Avatar de ${user.first_name}`}
                          width={32}
                          height={32}
                          className="rounded-full object-cover"
                        />
                        <span>
                          {user.first_name} {user.last_name}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.country}</td>
                    <td className="p-3 capitalize">{user.role}</td>
                    <td className="p-3">{user.phone_number || "-"}</td>
                    <td className="p-3 flex gap-2 items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingUser(user)}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingUser(user);
                          setSelectedRole(user.role);
                        }}
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {editingUser && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
              <h2 className="text-lg font-semibold mb-4">
                Editar Rol de {editingUser.first_name}
              </h2>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full border rounded p-2 mb-4"
              >
                {roles.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingUser(null)}>
                  Cancelar
                </Button>
                <Button
                  onClick={() => handleRoleChange(editingUser.id, selectedRole)}
                >
                  Guardar
                </Button>
              </div>
            </div>
          </div>
        )}

        {deletingUser && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
              <h2 className="text-lg font-semibold mb-2">
                Confirmar Eliminación
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                ¿Estás seguro de que quieres eliminar al usuario{" "}
                <strong>
                  {deletingUser.first_name} {deletingUser.last_name}
                </strong>
                ? Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDeletingUser(null)}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleConfirmDelete}>
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
