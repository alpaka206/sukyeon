type Props = {
  readonly title: string;
  readonly wide?: boolean;
};

export default function PageHeader({ title, wide = false }: Props) {
  return (
    <div className={`relative overflow-hidden bg-brand py-13 text-white lg:py-16.5 ${wide ? "wide-shell" : "shell"}`}>
      <div className="relative">
        <h1 className="m-0 fs-1 font-extrabold tracking-[-1px]">
          {title}
        </h1>
      </div>
    </div>
  );
}
