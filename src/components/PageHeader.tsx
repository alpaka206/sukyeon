type Props = {
  eyebrow: string;
  title: string;
  breadcrumb: string;
};

export default function PageHeader({ eyebrow, title, breadcrumb }: Props) {
  return (
    <div className="relative overflow-hidden bg-[#0a1b33] shell py-[52px] text-white lg:py-[66px]">
      <div className="relative">
        <div className="mb-3.5 font-mono text-[13px] tracking-[2px] text-[#4f74e6]">
          {eyebrow}
        </div>
        <h1 className="m-0 mb-3 fs-1 font-extrabold tracking-[-1px]">
          {title}
        </h1>
        <div className="text-[14px] text-[#9fb0c9]">{breadcrumb}</div>
      </div>
    </div>
  );
}
