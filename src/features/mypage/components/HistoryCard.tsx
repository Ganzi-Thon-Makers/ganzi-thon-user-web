import Image from "next/image";
import Link from "next/link";

interface HistoryCardProps {
  label: string;
  href: string;
}

export function HistoryCard({ label, href }: HistoryCardProps) {
  return (
    <Link
      href={href}
      className="flex min-w-0 flex-col gap-3 rounded-lg bg-gray800 px-4 py-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <div className="relative -mr-0.5 size-17.25 max-w-full self-end overflow-hidden">
        <Image
          src="/frowning.webp"
          alt=""
          width={228}
          height={339}
          className="absolute -top-3.75 left-3.75 w-17.25 max-w-none origin-top-left rotate-15"
        />
      </div>
      <span className="text-body-sb-16 wrap-anywhere break-keep text-gray50">{label}</span>
    </Link>
  );
}
