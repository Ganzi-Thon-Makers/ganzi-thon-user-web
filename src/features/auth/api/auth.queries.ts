import { mutationOptions } from "@tanstack/react-query";

import { setAccessToken } from "@/shared/api/token";

import { login } from "./auth.api";

export const authMutations = {
  login: () =>
    mutationOptions({
      mutationFn: login,
      onSuccess: (data, _variables, _result, { client }) => {
        client.clear();
        setAccessToken(data.accessToken);
      },
    }),
};
