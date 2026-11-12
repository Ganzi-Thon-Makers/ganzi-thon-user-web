"use client";

import { BottomNavigation } from "@/shared/ui/BottomNavigation";

export function StampNavigation() {
  const handleOpenQr = () => {
    // TODO: QR 코드 핸들링하는 로직 넣기
  };

  return <BottomNavigation onQrClick={handleOpenQr} />;
}
