import Image from "next/image";

import { LoginForm } from "../components/LoginForm";

const image = "/login-hero.webp";

export function LoginPage() {
  return (
    <div>
      <h1 className="sr-only">로그인</h1>

      {/* 이미지 자리 */}
      <div className="relative aspect-[0.97/1] w-full">
        <Image src={image} alt="" fill loading="eager" />
      </div>

      <LoginForm />
    </div>
  );
}
