import Image from "next/image";

export function BoothGuideBanner() {
  return (
    <div className="flex min-h-19 items-center overflow-hidden rounded-lg bg-red500 px-3 py-1.5">
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 break-keep text-gray50">
        <p className="text-title-sb-18">부스 위치를 확인해보세요</p>
        <p className="text-body-r-14">부스를 누르면 서비스를 확인할 수 있어요</p>
      </div>
      <div className="-my-1.5 -mr-2 -ml-1 h-19 w-23.75 shrink-0 self-start overflow-hidden">
        <Image src="/happy.webp" alt="" width={237} height={333} className="-mt-3 w-full -scale-x-100" />
      </div>
    </div>
  );
}
