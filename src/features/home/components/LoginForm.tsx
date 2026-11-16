"use client";

import { useState } from "react";

import { Button } from "@/shared/ui/Button";
import { TextField } from "@/shared/ui/TextField";

export function LoginForm() {
  const [form, setForm] = useState({
    id: "",
    pw: "",
  });

  const trimmedId = form.id.trim();
  const trimmedPw = form.pw.trim();

  const isSubmitDisabled = !trimmedId || !trimmedPw;

  // TODO: API 요청에서 나온 에러 메시지를 setError로 담기
  // API 연동할 때 아래 error 및 사용처 주석 해제
  // const [error, setError] = useState<string | undefined>();

  const handleChange = (id: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitDisabled) return;

    // TODO: form state를 이용해서 API 연동하기
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
            value={form.id}
            onValueChange={(v) => handleChange("id", v)}
            placeholder="이니셜 + 전화번호 뒷자리"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="pw" className="text-body-m-14">
            비밀번호
          </label>
          <TextField
            id="pw"
            value={form.pw}
            onValueChange={(v) => handleChange("pw", v)}
            placeholder="이니셜 + 랜덤 숫자"
            type="password"
            // errorMessage={error}
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
