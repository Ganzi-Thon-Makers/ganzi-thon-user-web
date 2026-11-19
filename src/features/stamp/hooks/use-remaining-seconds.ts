"use client";

import { useEffect, useState } from "react";

const TICK_MS = 1000;

function getRemainingSeconds(expiresAt: string, now: number) {
  return Math.max(0, Math.ceil((new Date(expiresAt).getTime() - now) / 1000));
}

/** 만료 시각까지 남은 초. 1초마다 갱신하고 0이 되면 멈춘다. expiresAt이 없으면 null */
export function useRemainingSeconds(expiresAt: string | null): number | null {
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    if (!expiresAt) return;
    const expiry = expiresAt;
    let timeoutId: number;

    function tick() {
      const currentTime = Date.now();
      setNow(currentTime);
      if (getRemainingSeconds(expiry, currentTime) > 0) {
        timeoutId = window.setTimeout(tick, TICK_MS);
      }
    }

    tick();
    return () => window.clearTimeout(timeoutId);
  }, [expiresAt]);

  return expiresAt ? getRemainingSeconds(expiresAt, now) : null;
}
