type Props = {
  eyebrow: string;
  title: string;
  breadcrumb: string;
};

export default function PageHeader({ eyebrow, title, breadcrumb }: Props) {
  return (
    <div className="relative overflow-hidden bg-[#0a1b33] px-5 py-[52px] text-white lg:px-[60px] lg:py-[66px]">
      <div className="pointer-events-none absolute -right-[60px] -top-20 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(15,176,200,0.28),transparent_65%)]" />
      <div className="relative">
        <div className="mb-3.5 font-mono text-[13px] tracking-[2px] text-[#0fb0c8]">
          {eyebrow}
        </div>
        <h1 className="m-0 mb-3 text-[34px] font-extrabold tracking-[-1px] lg:text-[44px]">
          {title}
        </h1>
        <div className="text-[14px] text-[#9fb0c9]">{breadcrumb}</div>
      </div>
    </div>
  );
}
