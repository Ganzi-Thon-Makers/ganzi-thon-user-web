import { LoginForm } from "../components/LoginForm";

export function HomePage() {
  return (
    <div>
      {/* 이미지 자리 */}
      <div className="aspect-[0.97/1] w-full bg-white" />

      <LoginForm />
    </div>
  );
}
