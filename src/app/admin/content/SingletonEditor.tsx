"use client";

import {
  type DragEvent,
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AddRepeaterButton,
  EditorNotice,
  EmptyRepeaterState,
  FormField,
  FormSection,
  RepeaterCard,
  StickySaveBar,
  TextAreaField,
  TextField,
  revealAndFocusField,
} from "./FormPrimitives";
import { saveContentAction as saveContentActionWithState } from "../actions";
import { EMPTY_CONTENT_ACTION_STATE } from "./ContentActionState";
import { readStringList } from "./stringList";

type FieldSpec = {
  readonly key: string;
  readonly label: string;
  readonly kind?: "text" | "textarea" | "url" | "select" | "image";
  readonly options?: readonly string[];
  readonly fields?: readonly FieldSpec[];
  readonly array?: FieldSpec;
  readonly reorderControls?: boolean;
};
type ContentRecord = Record<string, unknown>;
type Row = { readonly clientId: string; readonly value: ContentRecord };

function isRecord(value: unknown): value is ContentRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function objectAt(value: unknown): ContentRecord {
  return isRecord(value) ? value : {};
}
function stringAt(value: unknown): string {
  return typeof value === "string" ? value : "";
}
function rowsAt(value: unknown): readonly ContentRecord[] {
  return Array.isArray(value) ? value.filter(isRecord) : [];
}
function imageRef(value: unknown): string {
  const asset = objectAt(objectAt(value)["asset"])["_ref"];
  return stringAt(asset);
}
function inputName(path: string): string {
  return `content.${path}`;
}
function clearName(path: string): string {
  return `clear.${path}`;
}
function useArrayMarker(path: string): void {
  useEffect(() => {
    const form = document.getElementById("singleton-content-form");
    if (!form) return;
    const marker = document.createElement("input");
    marker.type = "hidden";
    marker.name = `array.${path}`;
    marker.value = "replace";
    form.append(marker);
    return () => marker.remove();
  }, [path]);
}
function initialDocument(documentText: string): ContentRecord {
  try {
    const parsed: unknown = JSON.parse(documentText);
    return objectAt(parsed);
  } catch {
    return {};
  }
}

function schemaFor(
  type: "homePage" | "aboutPage" | "siteSettings",
): readonly FieldSpec[] {
  if (type === "homePage")
    return [
      {
        key: "hero",
        label: "첫 화면",
        fields: [
          { key: "titleLine1", label: "제목 첫 줄" },
          { key: "titleLine2", label: "제목 둘째 줄" },
          { key: "copyLine1", label: "설명 첫 줄", kind: "textarea" },
          { key: "copyLine2", label: "설명 둘째 줄", kind: "textarea" },
          { key: "primaryLabel", label: "주 버튼 문구" },
          { key: "primaryHref", label: "주 버튼 링크", kind: "url" },
          { key: "secondaryLabel", label: "보조 버튼 문구" },
          { key: "secondaryHref", label: "보조 버튼 링크", kind: "url" },
          {
            key: "slides",
            label: "슬라이드 이미지",
            array: {
              key: "slide",
              label: "슬라이드",
              fields: [
                {
                  key: "desktopImage",
                  label: "데스크톱 이미지",
                  kind: "image",
                },
                { key: "mobileImage", label: "모바일 이미지", kind: "image" },
                { key: "alt", label: "대체 텍스트" },
              ],
            },
          },
        ],
      },
      {
        key: "productsHeading",
        label: "제품 소개 제목",
        fields: [
          { key: "title", label: "제목" },
          { key: "moreLabel", label: "더보기 문구" },
          { key: "moreHref", label: "더보기 링크", kind: "url" },
        ],
      },
      {
        key: "productCards",
        label: "제품 미리보기 카드",
        array: {
          key: "card",
          label: "제품 카드",
          fields: [
            { key: "image", label: "이미지", kind: "image" },
            { key: "title", label: "제목" },
            { key: "tag", label: "태그" },
            { key: "desc", label: "설명", kind: "textarea" },
            { key: "href", label: "링크", kind: "url" },
          ],
        },
      },
      {
        key: "productsCta",
        label: "제품 CTA",
        fields: [
          { key: "title", label: "제목", kind: "textarea" },
          { key: "desc", label: "설명" },
          { key: "label", label: "버튼 문구" },
          { key: "href", label: "버튼 링크", kind: "url" },
        ],
      },
      {
        key: "whyHeading",
        label: "선택 이유 제목",
        fields: [{ key: "title", label: "제목" }],
      },
      {
        key: "whyItems",
        label: "선택 이유",
        array: {
          key: "reason",
          label: "선택 이유",
          fields: [
            {
              key: "icon",
              label: "아이콘",
              kind: "select",
              options: ["manufacturing", "quality", "delivery", "support"],
            },
            { key: "title", label: "제목" },
            { key: "desc", label: "설명", kind: "textarea" },
          ],
        },
      },
      {
        key: "contactCta",
        label: "문의 CTA",
        fields: [
          { key: "title", label: "제목", kind: "textarea" },
          { key: "desc", label: "설명" },
          { key: "primaryLabel", label: "주 버튼 문구" },
          { key: "primaryHref", label: "주 버튼 링크", kind: "url" },
          { key: "phoneLabel", label: "전화 버튼 문구" },
          { key: "phoneHref", label: "전화 링크", kind: "url" },
        ],
      },
    ];
  if (type === "aboutPage")
    return [
      {
        key: "greeting",
        label: "인사말",
        fields: [
          { key: "heading", label: "제목", kind: "textarea" },
          {
            key: "paragraphs",
            label: "본문 문단",
            array: { key: "paragraph", label: "문단", kind: "textarea" },
          },
          { key: "signName", label: "서명 이름" },
          { key: "signLabel", label: "서명 직함" },
          { key: "image", label: "이미지", kind: "image" },
        ],
      },
      {
        key: "info",
        label: "회사 소개",
        fields: [
          { key: "heading", label: "제목", kind: "textarea" },
          {
            key: "paragraphs",
            label: "본문 문단",
            array: { key: "paragraph", label: "문단", kind: "textarea" },
          },
          { key: "image", label: "이미지", kind: "image" },
          {
            key: "values",
            label: "핵심 가치",
            array: {
              key: "value",
              label: "핵심 가치",
              fields: [
                { key: "no", label: "번호" },
                { key: "title", label: "제목" },
                { key: "desc", label: "설명", kind: "textarea" },
              ],
            },
          },
        ],
      },
      {
        key: "equipment",
        label: "설비 현황",
        fields: [
          { key: "desc", label: "설명", kind: "textarea" },
          {
            key: "rows",
            label: "설비 목록",
            array: {
              key: "equipment",
              label: "설비",
              fields: [
                { key: "no", label: "구분" },
                { key: "name", label: "설비명" },
                { key: "cap", label: "설비 용량" },
              ],
            },
          },
        ],
      },
      {
        key: "history",
        label: "연혁",
        fields: [
          { key: "desc", label: "설명", kind: "textarea" },
          {
            key: "entries",
            label: "연혁 항목",
            array: {
              key: "history",
              label: "연혁",
              fields: [
                { key: "year", label: "연도" },
                {
                  key: "lines",
                  label: "내용",
                  array: {
                    key: "line",
                    label: "내용",
                    reorderControls: true,
                  },
                },
              ],
            },
          },
        ],
      },
      {
        key: "location",
        label: "오시는 길",
        fields: [{ key: "mapNote", label: "지도 안내 문구" }],
      },
    ];
  return [
    { key: "logo", label: "헤더 로고", kind: "image" },
    {
      key: "company",
      label: "회사 정보",
      fields: [
        { key: "name", label: "상호" },
        { key: "nameEn", label: "영문 상호" },
        { key: "ceo", label: "대표" },
        { key: "address", label: "주소" },
        { key: "tel", label: "전화" },
        { key: "fax", label: "팩스" },
        { key: "email", label: "이메일" },
        { key: "bizNo", label: "사업자등록번호" },
        { key: "hours", label: "영업시간" },
        { key: "blog", label: "블로그 URL", kind: "url" },
      ],
    },
    {
      key: "nav",
      label: "상단 메뉴",
      array: {
        key: "menu",
        label: "메뉴",
        fields: [
          { key: "label", label: "문구" },
          { key: "href", label: "링크", kind: "url" },
          {
            key: "children",
            label: "하위 메뉴",
            array: {
              key: "child",
              label: "하위 메뉴",
              fields: [
                { key: "label", label: "문구" },
                { key: "href", label: "링크", kind: "url" },
              ],
            },
          },
        ],
      },
    },
    { key: "footerTagline", label: "푸터 소개 문구", kind: "textarea" },
    {
      key: "footerColumns",
      label: "푸터 링크 열",
      array: {
        key: "column",
        label: "푸터 열",
        fields: [
          { key: "title", label: "열 제목" },
          {
            key: "links",
            label: "링크",
            array: {
              key: "link",
              label: "링크",
              fields: [
                { key: "label", label: "문구" },
                { key: "href", label: "링크", kind: "url" },
              ],
            },
          },
        ],
      },
    },
  ];
}

function AssetControl({
  label,
  path,
  value,
}: {
  readonly label: string;
  readonly path: string;
  readonly value: unknown;
}) {
  const [cleared, setCleared] = useState(false);
  const [selectedName, setSelectedName] = useState("");
  const ref = imageRef(value);
  const status = cleared
    ? "저장 시 현재 이미지를 삭제합니다."
    : selectedName
      ? `새 파일: ${selectedName}`
      : ref
        ? "현재 이미지가 유지됩니다."
        : "등록된 이미지가 없습니다.";

  return (
    <FormField
      label={label}
      description="파일은 저장을 누를 때만 업로드됩니다."
    >
      <div className="rounded-2xl border border-dashed border-[#b8c5da] bg-[#fbfcfe] p-4 transition-colors duration-150 focus-within:border-[#22409b] focus-within:bg-white">
        <p className="mb-3 inline-flex rounded-lg bg-white px-3 py-1.5 text-[13px] font-bold text-[#42526b] ring-1 ring-[#e2e6ed]">
          {status}
        </p>
        <input
          name={`asset.${path}`}
          type="file"
          accept="image/png,image/jpeg,image/gif,image/webp"
          disabled={cleared}
          onChange={(event) =>
            setSelectedName(event.currentTarget.files?.[0]?.name ?? "")
          }
          className="block min-h-11 w-full text-[14px] text-[#42526b] file:mr-3 file:min-h-11 file:rounded-lg file:border-0 file:bg-[#eef2fc] file:px-3 file:py-2 file:text-[14px] file:font-bold file:text-[#18306f] disabled:opacity-50"
        />
        {cleared && <input type="hidden" name={clearName(path)} value="true" />}
        <label className="mt-3 flex min-h-11 items-center gap-2 rounded-lg px-1 text-[14px] font-bold text-[#5a6680]">
          <input
            type="checkbox"
            checked={cleared}
            onChange={(event) => setCleared(event.currentTarget.checked)}
            className="size-4 accent-[#22409b]"
          />
          이미지 삭제
        </label>
      </div>
    </FormField>
  );
}

function Leaf({
  spec,
  path,
  value,
}: {
  readonly spec: FieldSpec;
  readonly path: string;
  readonly value: unknown;
}) {
  const [cleared, setCleared] = useState(false);
  if (spec.kind === "image")
    return <AssetControl label={spec.label} path={path} value={value} />;
  const clearControl = (
    <label className="mt-2 flex items-center gap-2 text-[13px] font-semibold text-[#5a6680]">
      <input
        type="checkbox"
        checked={cleared}
        onChange={(event) => setCleared(event.currentTarget.checked)}
      />
      값 삭제
    </label>
  );
  if (cleared)
    return (
      <FormField label={spec.label}>
        <input type="hidden" name={clearName(path)} value="true" />
        {clearControl}
      </FormField>
    );
  if (spec.kind === "textarea")
    return (
      <div>
        <TextAreaField
          id={path}
          label={spec.label}
          name={inputName(path)}
          defaultValue={stringAt(value)}
        />
        {clearControl}
      </div>
    );
  if (spec.kind === "select")
    return (
      <div>
        <FormField label={spec.label} htmlFor={path}>
          <select
            id={path}
            name={inputName(path)}
            defaultValue={stringAt(value)}
            className="min-h-11 w-full rounded-lg border border-[#d4dae4] px-3"
          >
            {spec.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormField>
        {clearControl}
      </div>
    );
  return (
    <div>
      <TextField
        id={path}
        label={spec.label}
        name={inputName(path)}
        type="text"
        defaultValue={stringAt(value)}
      />
      {clearControl}
    </div>
  );
}

function ArrayEditor({
  spec,
  path,
  value,
  onDirty,
}: {
  readonly spec: FieldSpec;
  readonly path: string;
  readonly value: unknown;
  readonly onDirty: () => void;
}) {
  // 문단·연혁 내용처럼 배열 원소가 문자열 자체인 leaf 배열은 {item} 행으로 승격해
  // 편집할 수 있게 한다(레코드만 남기면 기존 문자열 데이터가 전부 사라진 채 저장된다).
  const leafArray = Boolean(spec.array && !spec.array.fields);
  const [rows, setRows] = useState<readonly Row[]>(() =>
    leafArray
      ? readStringList(value).map((entry) => ({
          clientId: crypto.randomUUID(),
          value: { item: entry },
        }))
      : rowsAt(value).map((entry) => ({
          clientId: crypto.randomUUID(),
          value: entry,
        })),
  );
  const [newRowIds] = useState(() => new Set<string>());
  const [draftTitles, setDraftTitles] = useState<Record<string, string>>({});
  const [draggingId, setDraggingId] = useState<string | null>(null);
  useArrayMarker(path);
  const reorderRows = (sourceId: string, targetId: string) => {
    if (!sourceId || sourceId === targetId) return;
    onDirty();
    setRows((current) => {
      const from = current.findIndex((entry) => entry.clientId === sourceId);
      const target = current.findIndex((entry) => entry.clientId === targetId);
      if (from < 0 || target < 0 || from === target) return current;
      const next = [...current];
      const [picked] = next.splice(from, 1);
      if (!picked) return current;
      next.splice(target, 0, picked);
      return next;
    });
  };
  const beginDrag = (event: DragEvent<HTMLElement>, clientId: string) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", clientId);
    setDraggingId(clientId);
  };
  const item = spec.array;
  if (!item) return null;
  const addRow = () => {
    const clientId = crypto.randomUUID();
    newRowIds.add(clientId);
    setRows((current) => [...current, { clientId, value: {} }]);
    onDirty();
  };
  return (
    <div className="grid gap-4 rounded-2xl border border-[#e2e6ed] bg-[#fbfcfe] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="m-0 text-[15px] font-extrabold text-[#0a1b33]">
            {spec.label}
          </h3>
          <p className="m-0 mt-1 text-[13px] font-semibold text-[#5a6680]">
            {rows.length}개 등록됨
          </p>
        </div>
        <AddRepeaterButton label={spec.label} onClick={addRow} />
      </div>
      {rows.length === 0 && (
        <EmptyRepeaterState label={spec.label} onAdd={addRow} />
      )}
      {rows.map((row, index) => {
        const existingKey = stringAt(row.value["_key"]);
        const titleValue =
          draftTitles[row.clientId] ||
          stringAt(row.value["title"]) ||
          stringAt(row.value["label"]) ||
          stringAt(row.value["name"]) ||
          stringAt(row.value["year"]);
        return (
          <RepeaterCard
            key={row.clientId}
            title={
              titleValue
                ? `${index + 1}. ${titleValue}`
                : `${item.label} ${index + 1}`
            }
            defaultOpen={newRowIds.has(row.clientId)}
            onRemove={() => {
              setRows((current) =>
                current.filter((entry) => entry.clientId !== row.clientId),
              );
              onDirty();
            }}
            onDragStart={(event) => beginDrag(event, row.clientId)}
            onDragOver={(event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = "move";
            }}
            onDrop={(event) => {
              event.preventDefault();
              reorderRows(
                event.dataTransfer.getData("text/plain"),
                row.clientId,
              );
              setDraggingId(null);
            }}
            onDragEnd={() => setDraggingId(null)}
            dragging={draggingId === row.clientId}
            onMoveUp={
              item.reorderControls && index > 0
                ? () =>
                    reorderRows(
                      row.clientId,
                      rows[index - 1]?.clientId ?? "",
                    )
                : undefined
            }
            onMoveDown={
              item.reorderControls && index < rows.length - 1
                ? () =>
                    reorderRows(
                      row.clientId,
                      rows[index + 1]?.clientId ?? "",
                    )
                : undefined
            }
          >
            {existingKey && (
              <input
                type="hidden"
                name={inputName(`${path}.${index}._key`)}
                value={existingKey}
              />
            )}
            <div
              onInput={(event) => {
                const target = event.target;
                if (
                  !(target instanceof HTMLInputElement) &&
                  !(target instanceof HTMLTextAreaElement)
                ) {
                  return;
                }
                if (!/\.(title|label|name|year)$/.test(target.name)) return;
                const value = target.value;
                setDraftTitles((current) => ({
                  ...current,
                  [row.clientId]: value,
                }));
              }}
            >
              {item.fields ? (
                <Fields
                  specs={item.fields}
                  path={`${path}.${index}`}
                  value={row.value}
                  onDirty={onDirty}
                />
              ) : (
                <Leaf
                  spec={item}
                  path={`${path}.${index}`}
                  value={row.value["item"]}
                />
              )}
            </div>
          </RepeaterCard>
        );
      })}
    </div>
  );
}

function Fields({
  specs,
  path,
  value,
  onDirty,
}: {
  readonly specs: readonly FieldSpec[];
  readonly path: string;
  readonly value: ContentRecord;
  readonly onDirty: () => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {specs.map((spec) => {
        const nextPath = path ? `${path}.${spec.key}` : spec.key;
        const nextValue = value[spec.key];
        if (spec.array)
          return (
            <div key={nextPath} className="md:col-span-2">
              <ArrayEditor
                spec={spec}
                path={nextPath}
                value={nextValue}
                onDirty={onDirty}
              />
            </div>
          );
        if (spec.fields)
          return (
            <div key={nextPath} className="md:col-span-2">
              <FormSection title={spec.label}>
                <Fields
                  specs={spec.fields}
                  path={nextPath}
                  value={objectAt(nextValue)}
                  onDirty={onDirty}
                />
              </FormSection>
            </div>
          );
        return (
          <Leaf key={nextPath} spec={spec} path={nextPath} value={nextValue} />
        );
      })}
    </div>
  );
}

export function SingletonEditor({
  type,
  id,
  revision,
  documentText,
}: {
  readonly type: "homePage" | "aboutPage" | "siteSettings";
  readonly id?: string;
  readonly revision?: string;
  readonly documentText: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    saveContentActionWithState,
    EMPTY_CONTENT_ACTION_STATE,
  );
  const [dirty, setDirty] = useState(false);
  const [resetVersion, setResetVersion] = useState(0);
  const document = initialDocument(documentText);
  const preview =
    type === "homePage" ? "/" : type === "aboutPage" ? "/about" : "/";
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (dirty) event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    form.querySelector("[data-action-feedback]")?.remove();
    const firstError = state.errors[0];
    if (!firstError) return;
    const summary = window.document.createElement("section");
    summary.dataset.actionFeedback = "true";
    // 필드를 특정하지 못한 오류는 배너 자신이 fallback 앵커(form-error-summary)가 된다.
    summary.id = "form-error-summary";
    summary.tabIndex = -1;
    summary.setAttribute("role", "alert");
    summary.className =
      "rounded-xl border border-[#f0c9c9] bg-[#fff5f5] p-4 text-[#7f1d1d]";
    const title = window.document.createElement("h2");
    title.className = "m-0 text-[16px] font-extrabold";
    title.textContent = "저장 내용을 확인해 주세요";
    const generic = firstError.field === "form-error-summary";
    const message = window.document.createElement(generic ? "p" : "a");
    message.className = `mt-2 block text-[14px] font-semibold${generic ? "" : " underline"}`;
    message.textContent = firstError.message;
    if (message instanceof HTMLAnchorElement) {
      message.href = `#${firstError.field}`;
      message.onclick = () => revealAndFocusField(form, firstError.field);
    }
    summary.append(title, message);
    form.prepend(summary);
    revealAndFocusField(form, firstError.field);
  }, [state.errors]);
  function discard() {
    if (!dirty || window.confirm("변경한 내용을 버리시겠습니까?")) {
      formRef.current?.reset();
      formRef.current?.querySelector("[data-action-feedback]")?.remove();
      setResetVersion((current) => current + 1);
      setDirty(false);
    }
  }
  return (
    <form
      ref={formRef}
      id="singleton-content-form"
      // action prop 대신 직접 dispatch: React 19는 form action이 에러 상태를 반환해도
      // 폼을 자동 reset해 사용자의 미저장 입력을 전부 날려버린다.
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(() => formAction(formData));
      }}
      onInput={() => setDirty(true)}
      onChange={() => setDirty(true)}
      className="grid gap-5"
    >
      <input type="hidden" name="type" value={type} />
      {id && <input type="hidden" name="id" value={id} />}
      {revision && <input type="hidden" name="revision" value={revision} />}
      <EditorNotice href={preview}>
        모든 항목은 저장 후 공개 페이지에 반영됩니다. 필요한 섹션만 펼쳐서
        편집할 수 있습니다.
      </EditorNotice>
      <Fields
        key={resetVersion}
        specs={schemaFor(type)}
        path=""
        value={document}
        onDirty={() => setDirty(true)}
      />
      <StickySaveBar
        formId="singleton-content-form"
        saving={isPending}
        changed={dirty}
        onCancel={discard}
      />
    </form>
  );
}
