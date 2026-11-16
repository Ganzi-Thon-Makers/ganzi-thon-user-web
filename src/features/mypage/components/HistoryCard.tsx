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
      <Image
        src="/button.webp"
        alt=""
        width={124}
        height={69}
        className="h-17.25 w-full max-w-31 self-end object-contain"
      />
      <span className="text-body-sb-16 wrap-anywhere break-keep text-gray50">{label}</span>
    </Link>
  );
}
