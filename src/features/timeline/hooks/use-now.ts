import { useEffect, useState } from "react";

const MINUTE_MS = 60_000;

export function useNow() {
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    let timeoutId: number;

    function updateNow() {
      const currentTime = Date.now();
      setNow(currentTime);
      timeoutId = window.setTimeout(updateNow, MINUTE_MS - (currentTime % MINUTE_MS));
    }

    updateNow();
    return () => window.clearTimeout(timeoutId);
  }, []);

  return now;
}
