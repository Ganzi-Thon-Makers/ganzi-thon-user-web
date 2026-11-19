"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { toApiError } from "@/shared/api/error";
import { getAfterLoginPath } from "@/shared/lib/login-return";
import { Button } from "@/shared/ui/Button";
import { TextField } from "@/shared/ui/TextField";

import { authMutations } from "../api/auth.queries";

export function LoginForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    loginId: "",
    password: "",
  });
  const [error, setError] = useState<string | undefined>();

  const [isNavigating, startTransition] = useTransition();

  const { mutate, isPending } = useMutation(authMutations.login());

  const trimmedId = form.loginId.trim();
  const trimmedPw = form.password.trim();

  const isSubmitDisabled = !trimmedId || !trimmedPw || isPending || isNavigating;

  const handleChange = (id: keyof typeof form, value: string) => {
    setError(undefined);
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitDisabled) return;

    setError(undefined);
    mutate(form, {
      onSuccess: () => startTransition(() => router.replace(getAfterLoginPath(window.location.search))),
      onError: (err) => {
        const { message } = toApiError(err);
        setError(message);
      },
    });
  };

  return (
    <form className="flex flex-col gap-13 px-5 py-12" onSubmit={handleSubmit}>
      <section className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="id" className="text-body-m-14">
            아이디
          </label>
          <TextField
            id="id"
            value={form.loginId}
            onValueChange={(v) => handleChange("loginId", v)}
            placeholder="이니셜 + 전화번호 뒷자리"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="pw" className="text-body-m-14">
            비밀번호
          </label>
          <TextField
            id="pw"
            value={form.password}
            onValueChange={(v) => handleChange("password", v)}
            placeholder="이니셜 + 랜덤 숫자"
            type="password"
            errorMessage={error}
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <Button type="submit" className="w-full" disabled={isSubmitDisabled}>
          로그인
        </Button>
        <p className="text-body-r-14 text-gray300">로그인에 문제가 있으면 디스코드 문의 채널로 알려주세요.</p>
      </section>
    </form>
  );
}
