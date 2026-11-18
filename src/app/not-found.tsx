import Image from "next/image";

import { ButtonLink } from "@/shared/ui/ButtonLink";

export default function Page() {
  return (
    <main className="mx-auto flex h-dvh flex-col items-center justify-center">
      <Image src="/frowning.webp" alt="" width={75} height={111} loading="eager" className="h-27.5 object-contain" />
      <div className="mt-3 mb-12 text-center text-body-sb-16 text-white">
        <h1>페이지를 찾을 수 없어요.</h1>
        <p>주소가 변경되었거나 없는 페이지예요.</p>
      </div>
      <ButtonLink href="/">홈으로 이동</ButtonLink>
    </main>
  );
}
