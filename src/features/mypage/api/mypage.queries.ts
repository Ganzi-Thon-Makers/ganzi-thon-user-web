import { mutationOptions, queryOptions } from "@tanstack/react-query";

import { clearAccessToken } from "@/shared/api/token";

import { getMyPage, logout } from "./mypage.api";

export const myPageQueries = {
  all: () => ["mypage"] as const,
  details: () => queryOptions({ queryKey: [...myPageQueries.all(), "details"], queryFn: getMyPage }),
};

export const myPageMutations = {
  logout: () =>
    mutationOptions({
      mutationFn: logout,
      onSuccess: clearAccessToken,
    }),
};
