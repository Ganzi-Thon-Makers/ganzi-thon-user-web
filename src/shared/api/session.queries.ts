import { mutationOptions } from "@tanstack/react-query";

import { logout } from "./session.api";
import { clearAccessToken } from "./token";

export const sessionMutations = {
  logout: () =>
    mutationOptions({
      mutationFn: logout,
      onSuccess: clearAccessToken,
    }),
};
