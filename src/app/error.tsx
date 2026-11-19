"use client";

import Image from "next/image";

import { Button } from "@/shared/ui/Button";

interface PageProps {
  retry: () => void;
}

export default function Page({ retry }: PageProps) {
  return (
    <main className="mx-auto flex h-dvh flex-col items-center justify-center">
      <Image src="/default.webp" alt="" width={80} height={111} loading="eager" className="h-27.5 object-contain" />
      <div role="alert" className="mt-3 mb-12 text-center text-body-sb-16 text-white">
        <h1>서비스에 잠시 문제가 생겼어요.</h1>
        <p>잠시 후 다시 시도해 주세요.</p>
      </div>
      <Button onClick={() => retry()}>다시 시도</Button>
    </main>
  );
}
