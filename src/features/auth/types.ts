export interface LoginRequest {
  loginId: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  role: "PARTICIPANT" | "TEAM" | "ADMIN" | "SUPER_ADMIN";
}

export type SessionResponse = Pick<LoginResponse, "accessToken">;
