import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type ProductImageCardProps = {
  readonly href: string;
  readonly img: string;
  readonly alt: string;
  readonly title: string;
  readonly tag: string;
  readonly desc: string;
};

type ProductIconCardProps = {
  readonly href: string;
  readonly title: string;
  readonly desc: string;
  readonly children: ReactNode;
};

export function ProductImageCard({
  href,
  img,
  alt,
  title,
  tag,
  desc,
}: ProductImageCardProps) {
  return (
    <Link href={href} className="card-link overflow-hidden rounded-2xl border border-[#e2e6ed] bg-white">
      <div className="flex h-42.5 items-center justify-center border-b border-[#eef1f5] bg-white p-3.5">
        <Image src={img} alt={alt} width={320} height={170} className="max-h-full max-w-full object-contain" />
      </div>
      <div className="p-6.5">
        <h3 className="m-0 mb-2 text-[20px] font-bold">
          {title} <span className="font-mono text-[13px] text-[#22409b]">{tag}</span>
        </h3>
        <p className="m-0 text-[15px] leading-[1.6] text-[#5a6680]">{desc}</p>
      </div>
    </Link>
  );
}

export function ProductIconCard({
  href,
  title,
  desc,
  children,
}: ProductIconCardProps) {
  return (
    <Link href={href} className="card-link overflow-hidden rounded-2xl border border-[#e2e6ed] bg-white">
      <div className="flex h-42.5 items-center justify-center border-b border-[#eef1f5] bg-[#f3f6f9]">
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#9fb0c9" strokeWidth="1.4">
          {children}
        </svg>
      </div>
      <div className="p-6.5">
        <h3 className="m-0 mb-2 text-[20px] font-bold">{title}</h3>
        <p className="m-0 text-[15px] leading-[1.6] text-[#5a6680]">{desc}</p>
      </div>
    </Link>
  );
}
