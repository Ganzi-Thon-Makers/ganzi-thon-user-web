import { api } from "./client";

export async function logout(): Promise<void> {
  const url = new URL("/api/auth/logout", window.location.origin);
  await api.post(url);
}
