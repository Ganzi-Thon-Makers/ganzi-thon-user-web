import { PawLogoIcon } from "@/shared/ui/icons";
import { ProgressBar } from "@/shared/ui/ProgressBar";

interface LuckyDrawCardProps {
  collectedCount: number;
  goalCount: number;
}

export function LuckyDrawCard({ collectedCount, goalCount }: LuckyDrawCardProps) {
  const remainingCount = goalCount - collectedCount;

  return (
    // 오른쪽 홈은 폭이 바뀌어도 모양이 유지되도록 마스크로 처리
    <div className="relative flex min-h-22.75 flex-col justify-center gap-2 rounded-lg bg-red500 mask-[radial-gradient(circle_at_right,transparent_11.5px,black_12px)] px-4 py-3.25 text-white">
      {remainingCount > 0 ? (
        <>
          <div className="flex flex-col gap-1">
            <p className="text-body-sb-14">럭키드로우까지</p>
            <p className="text-title-sb-20">{remainingCount}개</p>
          </div>
          <ProgressBar
            variant="red"
            value={collectedCount}
            max={goalCount}
            aria-label="럭키드로우 진행률"
            getAriaValueText={() => `${goalCount}개 중 ${collectedCount}개`}
          />
        </>
      ) : (
        <div className="flex flex-col gap-1">
          <p className="text-body-sb-14">럭키드로우</p>
          <p className="text-title-sb-20">응모 완료!</p>
        </div>
      )}
      <PawLogoIcon aria-hidden className="absolute top-9.5 right-6.5 text-red400" />
    </div>
  );
}
