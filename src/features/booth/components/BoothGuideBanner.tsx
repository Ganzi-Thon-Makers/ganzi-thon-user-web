import Image from "next/image";

export function BoothGuideBanner() {
  return (
    <div className="flex min-h-19 items-center overflow-hidden rounded-lg bg-red500 px-3 py-1.5">
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 break-keep text-gray50">
        <h1 className="text-title-sb-18">부스 위치를 확인해보세요</h1>
        <p className="text-body-r-14">부스를 누르면 정보를 확인할 수 있어요</p>
      </div>
      <div className="relative -my-1.5 -mr-2 -ml-1 w-23.75 shrink-0 self-stretch overflow-hidden">
        <Image
          src="/happy.webp"
          alt=""
          width={324}
          height={474}
          loading="eager"
          className="absolute -top-2.25 right-1.25 w-21.5"
        />
      </div>
    </div>
  );
}
