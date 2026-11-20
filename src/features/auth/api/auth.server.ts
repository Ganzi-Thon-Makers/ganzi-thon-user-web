import { type NextRequest, NextResponse } from "next/server";

import { backendApi } from "@/shared/api/client";
import type { ApiResponse } from "@/shared/api/types";

import type { LoginResponse } from "../types";

const cookieName = "refreshToken";
const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/api/auth",
} as const;

function authError(status: number, message: string) {
  return NextResponse.json({ message }, { status });
}

function isSameOrigin(request: NextRequest) {
  // Next의 내부 URL과 브라우저가 접근한 호스트가 프록시 뒤에서 다를 수 있다.
  const host = request.headers.get("host");
  return host && request.headers.get("origin") === `${request.nextUrl.protocol}//${host}`;
}

async function issueTokens(action: "login" | "refresh", json: unknown) {
  try {
    const upstream = await backendApi.post(`api/v1/auth/${action}`, {
      json,
      throwHttpErrors: false,
    });

    if (!upstream.ok) {
      return NextResponse.json(await upstream.json(), { status: upstream.status });
    }

    const { data } = await upstream.json<ApiResponse<LoginResponse>>();

    const response = NextResponse.json({ data: { accessToken: data.accessToken } });
    response.cookies.set(cookieName, data.refreshToken, cookieOptions);
    return response;
  } catch {
    return authError(502, "잠시 후 다시 시도해 주세요.");
  }
}

export async function login(request: NextRequest) {
  if (!isSameOrigin(request)) return authError(403, "허용되지 않은 요청이에요.");

  try {
    const input = await request.json();
    return issueTokens("login", input);
  } catch {
    return authError(400, "요청 형식을 확인해 주세요.");
  }
}

export async function refresh(request: NextRequest) {
  if (!isSameOrigin(request)) return authError(403, "허용되지 않은 요청이에요.");

  const refreshToken = request.cookies.get(cookieName)?.value;
  if (!refreshToken) return authError(401, "다시 로그인해 주세요.");

  const response = await issueTokens("refresh", { refreshToken });
  if (response.status === 401) {
    response.cookies.delete({ name: cookieName, ...cookieOptions });
  }

  return response;
}

export async function logout(request: NextRequest) {
  if (!isSameOrigin(request)) return authError(403, "허용되지 않은 요청이에요.");

  const authorization = request.headers.get("authorization");
  try {
    const upstream = await backendApi.post("api/v1/auth/logout", {
      headers: authorization ? { authorization } : undefined,
      throwHttpErrors: false,
    });
    if (!upstream.ok) {
      return NextResponse.json(await upstream.json(), { status: upstream.status });
    }

    const response = new NextResponse(null, { status: 204 });
    response.cookies.delete({ name: cookieName, ...cookieOptions });
    return response;
  } catch {
    return authError(502, "잠시 후 다시 시도해 주세요.");
  }
}
