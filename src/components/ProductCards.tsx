import Image from "next/image";
import Link from "next/link";

type ProductImageCardProps = {
  readonly href: string;
  readonly img: string;
  readonly alt: string;
  readonly title: string;
  readonly tag?: string;
  readonly desc: string;
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
        <Image src={img} alt={alt} width={320} height={170} style={{ width: "auto", height: "auto" }} className="max-h-full max-w-full object-contain" />
      </div>
      <div className="p-6.5">
        <h3 className="m-0 mb-2 text-[20px] font-bold">
          {title}
          {tag ? <span className="font-mono text-[13px] text-[#22409b]"> {tag}</span> : null}
        </h3>
        <p className="m-0 text-[15px] leading-[1.6] text-[#5a6680]">{desc}</p>
      </div>
    </Link>
  );
}
