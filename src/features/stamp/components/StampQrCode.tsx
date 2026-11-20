import { encode } from "uqr";

// QR 리더가 경계를 찾도록 남기는 여백(모듈 수). QR 표준 최소값 4
const QUIET_ZONE_MODULES = 4;

interface StampQrCodeProps {
  value: string;
  label: string;
}

/** 값을 QR 코드 SVG로 그린다. 모듈을 하나의 path로 합쳐 크기와 상관없이 선명하게 보인다 */
export function StampQrCode({ value, label }: StampQrCodeProps) {
  const { data, size } = encode(value, { border: QUIET_ZONE_MODULES });
  const path = data.flatMap((row, y) => row.map((isDark, x) => (isDark ? `M${x} ${y}h1v1h-1z` : ""))).join("");

  return (
    <svg
      aria-label={label}
      viewBox={`0 0 ${size} ${size}`}
      className="size-60 rounded-lg bg-white text-black"
      shapeRendering="crispEdges"
    >
      <title>{label}</title>
      <path d={path} fill="currentColor" />
    </svg>
  );
}
