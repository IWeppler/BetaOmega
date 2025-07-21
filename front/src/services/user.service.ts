import apiClient from "./api";
import { IUser, IUpdateUser, IChangePassword } from "@/interfaces";
import { AxiosError } from "axios";

const handleError = (err: unknown) => {
  const error = err as AxiosError<{ message?: string | string[] }>;
  const errorMessage = Array.isArray(error.response?.data?.message)
    ? error.response.data.message.join(", ")
    : error.response?.data?.message;

  return {
    success: false,
    error: errorMessage || error.message || "Error desconocido",
  };
};

export const updateUserProfile = async (values: IUpdateUser) => {
  try {
    const response = await apiClient.patch<IUser>("/users/me", values);
    return { success: true, user: response.data };
  } catch (err) {
    return handleError(err);
  }
};

export const changePassword = async (values: IChangePassword) => {
  try {
    const response = await apiClient.post("/users/me/change-password", values);
    return { success: true, message: response.data.message };
  } catch (err) {
    return handleError(err);
  }
};

export const uploadImageProfile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await apiClient.post<IUser>("/users/me/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return { success: true, user: response.data };
  } catch (err) {
    return handleError(err);
  }
};

export const fetchAllUsers = async () => {
  try {
    const response = await apiClient.get<IUser[]>("/users");
    return { success: true, users: response.data };
  } catch (err) {
    return handleError(err);
  }
};

export const updateUserRole = async (id: string, role: string) => {
  try {
    const response = await apiClient.patch<IUser>(`/users/${id}/role`, {
      role,
    });
    return { success: true, user: response.data };
  } catch (err) {
    return handleError(err);
  }
};

export const deleteUser = async (id: string) => {
  try {
    const response = await apiClient.delete<IUser>(`/users/${id}`);
    return { success: true, user: response.data };
  } catch (err) {
    return handleError(err);
  }

};
