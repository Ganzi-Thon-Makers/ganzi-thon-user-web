const SECONDS_PER_MINUTE = 60;

function formatRemaining(seconds: number) {
  const minutes = Math.floor(seconds / SECONDS_PER_MINUTE);
  const rest = seconds % SECONDS_PER_MINUTE;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

interface StampQrStatusProps {
  remainingSeconds: number;
  isExpired: boolean;
}

/** 발급한 QR의 남은 시간, 만료되면 재발급 안내 (Figma 913:9514 · 913:9525) */
export function StampQrStatus({ remainingSeconds, isExpired }: StampQrStatusProps) {
  const pillClassName = "rounded-full bg-gray800 px-4 py-2 text-center text-body-m-14 text-gray300 break-keep";

  if (isExpired) {
    return <output className={pillClassName}>QR 코드가 만료됐어요. 다시 발급해 주세요.</output>;
  }

  // 1초마다 읽어 주지 않도록 timer 역할(aria-live 꺼짐)
  return (
    <p role="timer" className={pillClassName}>
      QR 코드 만료까지{" "}
      <span className="text-body-sb-14 text-white tabular-nums">{formatRemaining(remainingSeconds)}</span>
    </p>
  );
}
