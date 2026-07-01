export type ProductDocument = {
  readonly label: string;
  readonly href: string;
};

export type ProductDetail = {
  readonly code: string;
  readonly image: string;
  readonly summary: string;
  readonly points: readonly string[];
  readonly documents?: readonly ProductDocument[];
};

export const releaseProductDetails = [
  {
    code: "SR-800",
    image: "/assets/sr-800.png",
    summary: "넓은 면적과 다양한 알루미늄 소재에 대응하는 범용 이형제입니다.",
    points: [
      "넓은 면적을 요구하는 제품에 사용 가능",
      "다양한 알루미늄 소재에 사용 가능",
      "도장성이 뛰어남",
      "주방제품에 적합함",
    ],
    documents: [
      { label: "SR-800 카탈로그", href: "/data/sr-800-catalog" },
      { label: "CAST ONE 시리즈 MSDS", href: "/data/cast-one-msds" },
    ],
  },
  {
    code: "SR-850",
    image: "/assets/sr-850.png",
    summary: "고온 영역과 복잡한 형상의 정밀 부품에 맞춘 이형제입니다.",
    points: [
      "고온 영역에서 뛰어난 이형성",
      "형상이 복잡한 정밀부품에 사용 가능",
      "알루미늄계 소재에 사용 가능",
      "전자제품에 적합함",
    ],
    documents: [
      { label: "SR-850 카탈로그", href: "/data/sr-850-catalog" },
      { label: "SR-850 RoHS 성적서", href: "/data/rohs-report" },
      { label: "CAST ONE 시리즈 MSDS", href: "/data/cast-one-msds" },
    ],
  },
  {
    code: "SR-900",
    image: "/assets/sr-900.png",
    summary: "대형 다이캐스팅 머신과 자동차 부품 공정에 적합한 제품입니다.",
    points: [
      "고온에서의 전착성 및 이형성이 뛰어남",
      "대형 다이캐스팅 머신과 정밀부품에 적용",
      "순수 알루미늄에 가까운 소재에 적용",
      "자동차부품에 적합함",
    ],
    documents: [
      { label: "SR-900 카탈로그", href: "/data/sr-900-catalog" },
      { label: "SR-900 RoHS 성적서", href: "/data/rohs-report" },
      { label: "CAST ONE 시리즈 MSDS", href: "/data/cast-one-msds" },
    ],
  },
  {
    code: "SR-950",
    image: "/assets/sr-950.png",
    summary: "마그네슘 및 알루미늄 다이캐스팅 외관 부품에 맞춘 이형제입니다.",
    points: [
      "고온에서의 전착성 및 이형성이 뛰어남",
      "마그네슘 및 알루미늄 다이캐스팅용 이형제",
      "외관 표면제품에 적합함",
    ],
    documents: [
      { label: "SR-950 카탈로그", href: "/data/sr-950-catalog" },
      { label: "SR-950 RoHS 성적서", href: "/data/rohs-report" },
      { label: "CAST ONE 시리즈 MSDS", href: "/data/cast-one-msds" },
    ],
  },
  {
    code: "SR-1200",
    image: "/assets/sr-1200.jpg",
    summary: "정밀 부품과 마그네슘 소재에 대응하는 수용성 이형제입니다.",
    points: [
      "뛰어난 이형성의 수용성 이형제",
      "정밀부품 및 마그네슘 소재에 사용",
      "도장성이 요구되는 정밀제품에 적용",
      "마그네슘제품에 적합함",
    ],
    documents: [
      { label: "SR-1200 카탈로그", href: "/data/sr-1200-catalog" },
      { label: "SR-1200 마그네슘 MSDS", href: "/data/sr-1200-magnesium-msds" },
    ],
  },
  {
    code: "ZM-12",
    image: "/assets/zm-12.png",
    summary: "아연 다이캐스팅과 도장성이 필요한 정밀 제품에 사용하는 희석형 이형제입니다.",
    points: [
      "아연 다이캐스팅용 이형제",
      "물로 희석하여 사용하는 이형제",
      "도장성이 요구되는 정밀 제품에 적용",
    ],
  },
] satisfies readonly ProductDetail[];

export const pranzaProductDetails = [
  {
    code: "SL-600",
    image: "/assets/sl-600.png",
    summary: "비흑연계 오일 타입의 플런저 윤활제로 작업 환경 개선에 적합합니다.",
    points: [
      "비흑연계 오일 타입의 플런저 윤활제",
      "작업환경 개선 및 기계 보전성 향상",
      "슬리브와 플런저 팁의 마모 방지",
      "경제성 및 생산성 향상",
    ],
    documents: [
      { label: "SL-600 카탈로그", href: "/data/sl-600-catalog" },
      { label: "LUBE ONE 시리즈 MSDS", href: "/data/lube-one-msds" },
      { label: "LUBE ONE RoHS 성적서", href: "/data/lube-one-rohs-report" },
    ],
  },
  {
    code: "SL-600M",
    image: "/assets/sl-600m.jpg",
    summary: "SL-600 계열의 플런저 윤활 제품으로 현장 도포 조건에 맞춰 운용합니다.",
    points: [
      "슬리브와 플런저 팁 윤활 관리에 사용",
      "마찰 저감과 사출 안정성 확보",
      "설비 보전성과 작업 편의성 향상",
      "현장 조건에 맞춰 도포량 조정 가능",
    ],
    documents: [
      { label: "SL-600M 카탈로그", href: "/data/sl-600m-catalog" },
      { label: "LUBE ONE 시리즈 MSDS", href: "/data/lube-one-msds" },
      { label: "LUBE ONE RoHS 성적서", href: "/data/lube-one-rohs-report" },
    ],
  },
  {
    code: "SL-600S",
    image: "/assets/sl-600s.png",
    summary: "고온 윤활제와 특수 첨가제를 배합해 피막 강도와 누설 방지 성능을 높인 제품입니다.",
    points: [
      "고온 윤활제, 특수첨가제 및 유제가 혼합된 제품",
      "피막 강도 증가와 우수한 누설 방지",
      "슬리브와 플런저 팁의 마모 방지",
      "경제성 및 생산성 향상",
    ],
    documents: [
      { label: "SL-600S 카탈로그", href: "/data/sl-600s-catalog" },
      { label: "LUBE ONE 시리즈 MSDS", href: "/data/lube-one-msds" },
      { label: "LUBE ONE RoHS 성적서", href: "/data/lube-one-rohs-report" },
    ],
  },
] satisfies readonly ProductDetail[];
