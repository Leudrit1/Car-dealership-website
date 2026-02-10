import { apiRequest } from "./queryClient";
import { type User } from "@shared/schema";

interface LoginResponse {
  user: User;
}

export async function login(username: string, password: string): Promise<User> {
  const res = await apiRequest("POST", "/api/login", { username, password });
  const data = (await res.json()) as LoginResponse;
  return data.user;
}

export async function logout(): Promise<void> {
  await apiRequest("POST", "/api/logout");
}

export async function getMe(): Promise<User | null> {
  try {
    const res = await apiRequest("GET", "/api/me");
    const data = (await res.json()) as LoginResponse;
    return data.user;
  } catch (error) {
    return null;
  }
}
