import { useState } from "react";

const SEEN_STORAGE_KEY = "stamp:lucky-draw-notice-seen";

// 저장소를 못 쓰는 환경(사생활 보호 모드 등)에서는 안내를 매번 보여주는 쪽으로 처리
function hasSeenNotice(): boolean {
  try {
    return localStorage.getItem(SEEN_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function markNoticeSeen() {
  try {
    localStorage.setItem(SEEN_STORAGE_KEY, "true");
  } catch {
    // 저장 실패 시 다음 방문에 안내가 다시 보일 뿐이라 무시
  }
}

/**
 * 럭키드로우 응모 안내(기능 명세서 STAMP-01-1: 15개 최초 달성 시 한 번만)를 띄울지 정한다.
 * 응모 여부는 서버(luckyDrawEntered)가 정하고, 안내를 이미 봤는지는 이 기기 기록으로 판단한다.
 * TODO: 적립 응답의 luckyDrawJustEntered로 "이번에 응모됨"을 받으면 기기 기록 없이 한 번만 띄울 수 있다.
 */
export function useLuckyDrawNotice(isEntered: boolean) {
  const [isDismissed, setIsDismissed] = useState(hasSeenNotice);

  function dismiss() {
    markNoticeSeen();
    setIsDismissed(true);
  }

  return { isOpen: isEntered && !isDismissed, dismiss };
}
