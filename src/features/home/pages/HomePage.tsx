import { LoginForm } from "../components/LoginForm";

export function HomePage() {
  return (
    <div>
      <h1 className="sr-only">로그인</h1>

      {/* 이미지 자리 */}
      <div className="aspect-[0.97/1] w-full bg-white" />

      <LoginForm />
    </div>
  );
}
