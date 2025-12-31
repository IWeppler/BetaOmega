"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchAllUsers,
  updateUserRole,
  deleteUser as deleteUserService,
} from "@/services/user.service";
import { IUser, UserRole } from "@/interfaces";
import { Button } from "@/shared/ui/buttoncn";
import { Loader2, PencilIcon, TrashIcon, X } from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileHeader } from "@/shared/components/MobileHeader";

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
  const [selectedUserForModal, setSelectedUserForModal] =
    useState<IUser | null>(null);
  const isMobile = useIsMobile();

  const handleError = (error: unknown) => {
    let errorMessage = "Ocurrió un error inesperado";

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "object" && error !== null) {
      if ("error" in error) {
        errorMessage = String((error as { error: unknown }).error);
      } else if ("message" in error) {
        errorMessage = String((error as { message: unknown }).message);
      }
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    toast.error(errorMessage);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchAllUsers();
      if (result.success && result.users) {
        setUsers(result.users);
      } else {
        handleError(result);
      }
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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
      setSelectedUserForModal(null);
      toast.success("Rol de usuario actualizado correctamente.");
    } else {
      handleError(res);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingUser) return;

    const res = await deleteUserService(deletingUser.id);
    if (res.success) {
      setUsers(users.filter((u) => u.id !== deletingUser.id));
      setDeletingUser(null);
      setSelectedUserForModal(null);
      toast.success("Usuario eliminado correctamente.");
    } else {
      handleError(res);
      setDeletingUser(null);
    }
  };

  // Función para abrir el modal de detalles del usuario en mobile
  const openUserDetailsModal = (user: IUser) => {
    setSelectedUserForModal(user);
  };

  // Función para cerrar el modal de detalles
  const closeUserDetailsModal = () => {
    setSelectedUserForModal(null);
  };

  return (
    <div className="flex-1 flex flex-col">
      <MobileHeader
        title="Gestión de Usuarios"
        subtitle="Gestiona tus usuarios aquí."
      />
      <main className="flex-1 overflow-auto p-6 bg-linear-to-b from-[#f9f7f5] to-white">
        {loading ? (
          <div className="flex-1 flex items-center justify-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        ) : (
          <>
            {/* VISTA DE ESCRITORIO (TABLA) */}
            {!isMobile && (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow rounded-lg responsive-table">
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
                        <td className="p-3" data-label="Usuario">
                          <div className="flex items-center gap-3">
                            <Image
                              src={user.avatar_url || "/default-avatar.jpg"}
                              alt={`Avatar de ${user.full_name}`}
                              width={32}
                              height={32}
                              className="rounded-full object-cover"
                            />
                            <span>{user.full_name}</span>
                          </div>
                        </td>
                        <td className="p-3" data-label="Email">
                          {user.email}
                        </td>
                        <td className="p-3" data-label="País">
                          {user.country}
                        </td>
                        <td className="p-3 capitalize" data-label="Rol">
                          {user.role}
                        </td>
                        <td className="p-3" data-label="Teléfono">
                          {user.phone_number || "-"}
                        </td>
                        <td
                          className="p-3 flex gap-2 items-center"
                          data-label="Acciones"
                        >
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
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeletingUser(user)}
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* VISTA DE MÓVIL (LISTA DE TARJETAS/USUARIOS CLICKEABLES) */}
            {isMobile && (
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="bg-white shadow rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => openUserDetailsModal(user)}
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={user.avatar_url || "/default-avatar.jpg"}
                        alt={`Avatar de ${user.full_name}`}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          {user.full_name}
                        </p>
                        <p className="text-sm text-gray-500 capitalize">
                          {user.role}
                        </p>
                      </div>
                      <PencilIcon className="w-4 h-4 text-gray-400" />{" "}
                      {/* Un pequeño icono para indicar que es clickeable */}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* MODAL DE DETALLES Y ACCIONES RÁPIDAS (para mobile) */}
        {isMobile && selectedUserForModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-49">
            {" "}
            {/* z-index alto */}
            <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-sm mx-4 relative">
              <button
                onClick={closeUserDetailsModal}
                className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
              <div className="flex flex-col items-center mb-4">
                <Image
                  src={selectedUserForModal.avatar_url || "/default-avatar.jpg"}
                  alt={`Avatar de ${selectedUserForModal.full_name}`}
                  width={80}
                  height={80}
                  className="rounded-full object-cover mb-3"
                />
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {selectedUserForModal.full_name}{" "}
                </h2>
                <p className="text-sm text-gray-600 mb-1">
                  {selectedUserForModal.email}
                </p>
                <p className="text-sm text-gray-500 capitalize">
                  {selectedUserForModal.role}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <p className="text-sm text-gray-700">
                  <strong>País:</strong> {selectedUserForModal.country}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Teléfono:</strong>{" "}
                  {selectedUserForModal.phone_number || "-"}
                </p>
                {/* Agrega más detalles si los hay */}
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  className="w-full"
                  onClick={() => {
                    setEditingUser(selectedUserForModal);
                    setSelectedRole(selectedUserForModal.role);
                  }}
                >
                  <PencilIcon className="w-4 h-4 mr-2" /> Editar Rol
                </Button>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => setDeletingUser(selectedUserForModal)}
                >
                  <TrashIcon className="w-4 h-4 mr-2" /> Eliminar Usuario
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL DE EDICIÓN DE ROL (existente) */}
        {editingUser && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
              <h2 className="text-lg font-semibold mb-4">
                Editar Rol de {editingUser.full_name}
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

        {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN (existente) */}
        {deletingUser && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
              <h2 className="text-lg font-semibold mb-2">
                Confirmar Eliminación
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                ¿Estás seguro de que quieres eliminar al usuario{" "}
                <strong>{deletingUser.full_name}</strong>? Esta acción no se
                puede deshacer.
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
