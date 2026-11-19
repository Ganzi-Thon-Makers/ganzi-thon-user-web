"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { toApiError } from "@/shared/api/error";
import { useToast } from "@/shared/ui/Toast";

import { myPageMutations } from "../api/mypage.queries";

export function LogoutButton() {
  const router = useRouter();

  const { error } = useToast();

  const [isNavigating, startTransition] = useTransition();
  const { mutate, isPending } = useMutation(myPageMutations.logout());

  const isLogoutDisabled = isPending || isNavigating;

  const handleLogout = () => {
    mutate(undefined, {
      onSuccess: () => startTransition(() => router.replace("/")),
      onError: (err) => {
        const { message } = toApiError(err);
        error(message);
      },
    });
  };

  return (
    <div className="mt-6 flex justify-center">
      <button
        type="button"
        disabled={isLogoutDisabled}
        onClick={handleLogout}
        className="cursor-pointer text-body-r-14 text-gray300 underline decoration-gray300 underline-offset-6"
      >
        로그아웃
      </button>
    </div>
  );
}
