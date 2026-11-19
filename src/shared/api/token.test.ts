import { afterEach, describe, expect, it } from "vitest";

import { getAccessTokenRole, setAccessToken } from "./token";

function fakeJwt(claims: object) {
  return `header.${Buffer.from(JSON.stringify(claims)).toString("base64url")}.signature`;
}

afterEach(() => window.localStorage.clear());

describe("getAccessTokenRole", () => {
  it("access token payload의 role claim을 읽는다", () => {
    setAccessToken(fakeJwt({ role: "TEAM" }));

    expect(getAccessTokenRole()).toBe("TEAM");
  });

  it("base64url의 -·_ 문자가 들어간 payload도 읽는다", () => {
    const token = fakeJwt({ role: "ADMIN", sid: "??>>" });
    expect(token).toMatch(/[-_]/);
    setAccessToken(token);

    expect(getAccessTokenRole()).toBe("ADMIN");
  });

  it("토큰이 없으면 null을 반환한다", () => {
    expect(getAccessTokenRole()).toBeNull();
  });

  it.each(["not-a-jwt", "header.%%%.signature", fakeJwt({ sub: "1" }), fakeJwt({ role: 1 })])(
    "role을 읽을 수 없는 토큰 %s는 null을 반환한다",
    (token) => {
      setAccessToken(token);

      expect(getAccessTokenRole()).toBeNull();
    },
  );
});
