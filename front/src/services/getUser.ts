import axios from "axios";
import { IUser } from "@/interfaces";


export async function getUser(): Promise<IUser | null> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener usuario", error);
    return null;
  }
}

