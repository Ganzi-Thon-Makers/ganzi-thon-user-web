import { mutationOptions } from "@tanstack/react-query";

import { login } from "./auth.api";

export const authMutations = {
  login: () =>
    mutationOptions({
      mutationFn: login,
    }),
};
