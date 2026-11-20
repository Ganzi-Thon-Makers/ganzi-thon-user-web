import { useEffect, useState } from "react";

let pendingNotice: string | null = null;

// 기본 카메라 적립 화면에서 스탬프판으로 이동하는 동안만 안내를 보관
export function queueLuckyDrawNotice(stampedAt: number) {
  pendingNotice = String(stampedAt);
}

export function useLuckyDrawNotice(stampedAt: string | null) {
  const [isOpen, setIsOpen] = useState(() => stampedAt !== null && pendingNotice === stampedAt);

  useEffect(() => {
    if (pendingNotice === stampedAt) pendingNotice = null;
  }, [stampedAt]);

  return { isOpen, dismiss: () => setIsOpen(false) };
}
