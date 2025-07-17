import apiClient from './api';
import { ILogin, IRegister, IUser } from '@/interfaces';
import { AxiosError } from 'axios';

const handleError = (err: unknown) => {
  const error = err as AxiosError<{ message?: string }>;
  return {
    success: false,
    error: error.response?.data?.message || error.message || 'Error desconocido',
  };
};

export const login = async (values: ILogin) => {
  try {
    const response = await apiClient.post('/auth/login', values);
    return { success: true, user: response.data.user };
  } catch (err) {
    return handleError(err);
  }
};

export const register = async (values: IRegister) => {
  try {
    const response = await apiClient.post('/auth/register', values);
    return { success: true, data: response.data };
  } catch (err) {
    return handleError(err);
  }
};

export const logout = async () => {
  try {
    await apiClient.post('/auth/logout');
    return { success: true };
  } catch (err) {
    return handleError(err);
  }
};

export const getMe = async (): Promise<IUser | null> => {
  try {
    const response = await apiClient.get<IUser>('/auth/me');
    return response.data;
  } catch {
    return null;
  }
};
