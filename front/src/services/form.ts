import {ILogin, IRegister} from "@/interfaces";
import axios, { AxiosError } from "axios";


export const loginAction = async (values: ILogin) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
      values,
      { withCredentials: true }
    );
    return { success: true, user: response.data.user };
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return {
      success: false,
      error:
        error.response?.data?.message || error.message || "Error desconocido",
    };
  }
};

export const registerAction = async (values: IRegister) => {
  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/users/register`,
      values,
      { withCredentials: true }
    );
    return { success: true };
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    return {
      success: false,
      error:
        error.response?.data?.message || error.message || "Error desconocido",
    };
  }
};