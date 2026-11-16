import { queryOptions } from "@tanstack/react-query";

import { getMyPage } from "./mypage.api";

export const myPageQueries = {
  all: () => ["mypage"] as const,
  details: () => queryOptions({ queryKey: [...myPageQueries.all(), "details"], queryFn: getMyPage }),
};
