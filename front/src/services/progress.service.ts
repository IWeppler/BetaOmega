import apiClient from './api';
import { IUserProgress, IUpsertProgressDto } from '@/interfaces';

export const fetchUserProgress = async (userId: string): Promise<IUserProgress[]> => {
  try {
    const response = await apiClient.get<IUserProgress[]>(`/progress/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener el progreso del usuario:', error);
    return [];
  }
};

export const upsertUserProgress = async (data: IUpsertProgressDto): Promise<IUserProgress | null> => {
  try {
    const response = await apiClient.post<IUserProgress>('/progress', data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el progreso:', error);
    return null;
  }
};
