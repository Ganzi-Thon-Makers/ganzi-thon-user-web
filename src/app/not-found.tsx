"use client";

import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/shared/ui/Button";

const image = "/frowning.webp";

export default function Page() {
  return (
    <main className="mx-auto flex h-dvh flex-col items-center justify-center">
      <Image src={image} alt="양갱즈 페이지 없음" width={75} height={111} />
      <p className="mt-3 mb-12 text-center text-body-sb-16 text-white">
        페이지를 찾을 수 없어요.
        <br />
        주소가 변경되었거나 없는 페이지예요.
      </p>
      <Link href="/" className={buttonVariants()}>
        홈으로 이동
      </Link>
    </main>
  );
}
