"use client";

import {
  type DragEvent,
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { saveContentAction as saveContentActionWithState } from "../actions";
import { EMPTY_CONTENT_ACTION_STATE } from "./ContentActionState";
import {
  controlClassName,
  FormField,
  TextAreaField,
  TextField,
  ToggleField,
} from "./AdminFields";
import {
  AddRepeaterButton,
  EditorNotice,
  EmptyRepeaterState,
  FormSection,
  RepeaterCard,
  StickySaveBar,
  revealAndFocusField,
} from "./AdminFormControls";
import { readStringList } from "./stringList";

type RecordValue = Record<string, unknown>;
type DocumentOption = { readonly id: string; readonly title: string };
type Row = { readonly clientId: string; readonly value: RecordValue };

function isRecord(value: unknown): value is RecordValue {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function record(value: unknown): RecordValue {
  return isRecord(value) ? value : {};
}
function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}
function values(value: unknown): readonly RecordValue[] {
  return Array.isArray(value) ? value.map(record) : [];
}
function name(path: string): string {
  return `content.${path}`;
}
function row(value: RecordValue = {}): Row {
  return { clientId: crypto.randomUUID(), value };
}
function imageRef(value: unknown): string {
  return text(record(record(value).asset)._ref);
}
function parseDocument(documentText: string): RecordValue {
  try {
    return record(JSON.parse(documentText));
  } catch {
    return {};
  }
}
function useArrayMarker(path: string): void {
  useEffect(() => {
    const form = document.getElementById("collection-content-form");
    if (!form) return;
    const marker = document.createElement("input");
    marker.type = "hidden";
    marker.name = `array.${path}`;
    marker.value = "replace";
    form.append(marker);
    return () => marker.remove();
  }, [path]);
}

function AssetPicker({
  path,
  value,
  label,
  pdf = false,
}: {
  readonly path: string;
  readonly value: unknown;
  readonly label: string;
  readonly pdf?: boolean;
}) {
  const [cleared, setCleared] = useState(false);
  const [selectedName, setSelectedName] = useState("");
  const status = cleared
    ? "저장 시 기존 파일을 제거합니다."
    : selectedName
      ? `새 파일: ${selectedName}`
      : imageRef(value)
        ? "현재 파일이 등록되어 있습니다."
        : "등록된 파일이 없습니다.";

  return (
    <FormField
      label={label}
      description={`${pdf ? "PDF" : "이미지"}는 저장을 누를 때만 업로드됩니다.`}
    >
      <div className="rounded-2xl border border-dashed border-[#b8c5da] bg-[#fbfcfe] p-4 transition-colors duration-150 focus-within:border-[#22409b] focus-within:bg-white">
        <p className="mb-3 inline-flex rounded-lg bg-white px-3 py-1.5 text-[13px] font-bold text-[#42526b] ring-1 ring-[#e2e6ed]">
          {status}
        </p>
        <input
          name={`asset.${path}`}
          type="file"
          accept={
            pdf
              ? "application/pdf"
              : "image/png,image/jpeg,image/gif,image/webp"
          }
          disabled={cleared}
          onChange={(event) =>
            setSelectedName(event.currentTarget.files?.[0]?.name ?? "")
          }
          className="block min-h-11 w-full text-[14px] text-[#42526b] file:mr-3 file:min-h-11 file:rounded-lg file:border-0 file:bg-[#eef2fc] file:px-3 file:py-2 file:text-[14px] file:font-bold file:text-[#18306f] disabled:opacity-50"
        />
        {cleared && <input type="hidden" name={`clear.${path}`} value="true" />}
        <label className="mt-3 flex min-h-11 items-center gap-2 rounded-lg px-1 text-[14px] font-bold text-[#5a6680]">
          <input
            type="checkbox"
            checked={cleared}
            onChange={(event) => setCleared(event.currentTarget.checked)}
            className="size-4 accent-[#22409b]"
          />
          현재 파일 제거
        </label>
      </div>
    </FormField>
  );
}

function Strings({
  path,
  label,
  value,
  onDirty,
}: {
  readonly path: string;
  readonly label: string;
  readonly value: unknown;
  readonly onDirty?: () => void;
}) {
  const initial = readStringList(value).map((item) => row({ item }));
  const [rows, setRows] = useState<readonly Row[]>(initial);
  useArrayMarker(path);
  return (
    <div className="grid gap-3 rounded-2xl border border-[#e2e6ed] bg-[#fbfcfe] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="m-0 text-[15px] font-extrabold text-[#0a1b33]">
          {label}
        </h3>
        <AddRepeaterButton
          label={label}
          onClick={() => {
            setRows((current) => [...current, row({ item: "" })]);
            onDirty?.();
          }}
        />
      </div>
      {rows.length === 0 && (
        <p className="m-0 rounded-xl bg-white px-3 py-3 text-[13px] font-semibold text-muted">
          아직 등록된 항목이 없습니다.
        </p>
      )}
      {rows.map((entry, index) => (
        <div key={entry.clientId} className="flex gap-2">
          <input
            id={`${path}.${index}`}
            aria-label={`${label} ${index + 1}`}
            name={name(`${path}.${index}`)}
            defaultValue={text(entry.value.item)}
            className={controlClassName}
          />
          <button
            type="button"
            onClick={() => {
              setRows((current) =>
                current.filter((item) => item.clientId !== entry.clientId),
              );
              onDirty?.();
            }}
            className="min-h-11 shrink-0 rounded-lg border border-[#f0c9c9] bg-white px-3 text-[13px] font-extrabold text-[#b3261e] transition-colors hover:bg-[#fff5f5]"
          >
            삭제
          </button>
        </div>
      ))}
    </div>
  );
}

function RelatedDocument({
  path,
  value,
  options,
}: {
  readonly path: string;
  readonly value: RecordValue;
  readonly options: readonly DocumentOption[];
}) {
  const currentRef = text(record(value.doc)._ref);
  const [mode, setMode] = useState<"doc" | "href">(currentRef ? "doc" : "href");
  const [doc, setDoc] = useState(currentRef);
  useEffect(() => {
    if (mode !== "doc") return;
    const form = document.getElementById("collection-content-form");
    if (!form) return;
    const counterpart = document.createElement("input");
    counterpart.type = "hidden";
    counterpart.name = name(`${path}.href`);
    counterpart.value = "";
    form.append(counterpart);
    return () => counterpart.remove();
  }, [mode, path]);
  return (
    <div className="grid gap-3 rounded-xl border border-[#e2e6ed] bg-white p-3">
      <fieldset>
        <legend className="mb-2 text-[13px] font-extrabold text-[#18306f]">
          자료 연결 방식
        </legend>
        <div className="flex flex-wrap gap-2">
          <label
            className={`inline-flex min-h-11 items-center gap-2 rounded-lg border px-3 text-[14px] font-bold ${mode === "doc" ? "border-[#22409b] bg-[#eef2fc] text-[#18306f]" : "border-[#d4dae4] text-[#42526b]"}`}
          >
            <input
              type="radio"
              checked={mode === "doc"}
              onChange={() => setMode("doc")}
            />
            자료실 문서
          </label>
          <label
            className={`inline-flex min-h-11 items-center gap-2 rounded-lg border px-3 text-[14px] font-bold ${mode === "href" ? "border-[#22409b] bg-[#eef2fc] text-[#18306f]" : "border-[#d4dae4] text-[#42526b]"}`}
          >
            <input
              type="radio"
              checked={mode === "href"}
              onChange={() => setMode("href")}
            />
            직접 링크
          </label>
        </div>
      </fieldset>
      {mode === "doc" ? (
        <FormField label="자료실 문서">
          <select
            value={doc}
            onChange={(event) => setDoc(event.currentTarget.value)}
            name={doc ? name(`${path}.doc`) : undefined}
            className={controlClassName}
          >
            <option value="">문서를 선택하세요</option>
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.title}
              </option>
            ))}
          </select>
        </FormField>
      ) : (
        <TextField
          id={`${path}.href`}
          label="직접 링크"
          name={name(`${path}.href`)}
          type="text"
          defaultValue={text(value.href)}
          placeholder="https:// 또는 / 경로"
        />
      )}
    </div>
  );
}

function RelatedDocuments({
  path,
  value,
  options,
  onDirty,
}: {
  readonly path: string;
  readonly value: unknown;
  readonly options: readonly DocumentOption[];
  readonly onDirty: () => void;
}) {
  const [rows, setRows] = useState<readonly Row[]>(() =>
    values(value).map(row),
  );
  useArrayMarker(path);
  const addRow = () => {
    setRows((current) => [...current, row()]);
    onDirty();
  };
  return (
    <div className="grid gap-3 rounded-2xl border border-[#e2e6ed] bg-[#fbfcfe] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="m-0 text-[15px] font-extrabold text-[#0a1b33]">
            관련 자료
          </h3>
          <p className="m-0 mt-1 text-[13px] font-semibold text-[#5a6680]">
            {rows.length}개 연결됨
          </p>
        </div>
        <AddRepeaterButton label="관련 자료" onClick={addRow} />
      </div>
      {rows.length === 0 && (
        <EmptyRepeaterState label="관련 자료" onAdd={addRow} />
      )}
      {rows.map((entry, index) => (
        <div
          key={entry.clientId}
          className="rounded-xl border border-[#d8e0ec] bg-white p-3"
        >
          {text(entry.value._key) && (
            <input
              type="hidden"
              name={name(`${path}.${index}._key`)}
              value={text(entry.value._key)}
            />
          )}
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h4 className="m-0 text-[14px] font-extrabold text-[#0a1b33]">
              자료 {index + 1}
            </h4>
            <button
              type="button"
              onClick={() => {
                setRows((current) =>
                  current.filter((item) => item.clientId !== entry.clientId),
                );
                onDirty();
              }}
              className="min-h-10 rounded-lg border border-[#f0c9c9] bg-white px-3 text-[13px] font-bold text-[#b3261e] transition-colors hover:bg-[#fff5f5]"
            >
              삭제
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              id={`${path}.${index}.label`}
              label="표시 이름"
              name={name(`${path}.${index}.label`)}
              defaultValue={text(entry.value.label)}
            />
            <RelatedDocument
              path={`${path}.${index}`}
              value={entry.value}
              options={options}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductItems({
  type,
  value,
  options,
  onDirty,
}: {
  readonly type: "productLineup" | "productGallery";
  readonly value: unknown;
  readonly options: readonly DocumentOption[];
  readonly onDirty: () => void;
}) {
  const [rows, setRows] = useState<readonly Row[]>(() =>
    values(value).map(row),
  );
  const [newRowIds] = useState(() => new Set<string>());
  const [draftTitles, setDraftTitles] = useState<Record<string, string>>({});
  const [draggingId, setDraggingId] = useState<string | null>(null);
  useArrayMarker("items");
  const gallery = type === "productGallery";
  function reorderRows(sourceId: string, targetId: string) {
    if (!sourceId || sourceId === targetId) return;
    onDirty();
    setRows((current) => {
      const from = current.findIndex((entry) => entry.clientId === sourceId);
      const to = current.findIndex((entry) => entry.clientId === targetId);
      if (from < 0 || to < 0 || from === to) return current;
      const next = [...current];
      const [picked] = next.splice(from, 1);
      if (!picked) return current;
      next.splice(to, 0, picked);
      return next;
    });
  }
  function beginDrag(event: DragEvent<HTMLElement>, clientId: string) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", clientId);
    setDraggingId(clientId);
  }
  const addRow = () => {
    const created = row();
    // 새 카드가 접힌 채 생성되면 required 입력이 hidden 상태로 남아 저장이 조용히 막힌다.
    newRowIds.add(created.clientId);
    setRows((current) => [...current, created]);
    onDirty();
  };
  return (
    <FormSection
      title={gallery ? "갤러리 항목" : "제품 목록"}
      description="카드를 잡아 끌어서 순서를 바꾸고, 왼쪽 화살표로 상세 정보를 펼칩니다."
      action={
        <AddRepeaterButton
          label={gallery ? "갤러리 항목" : "제품"}
          onClick={addRow}
        />
      }
    >
      <div className="grid gap-4">
        {rows.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#b8c5da] bg-[#f8fafc] px-4 py-5 text-center">
            <p className="m-0 text-[14px] font-bold text-[#42526b]">
              아직 등록된 {gallery ? "갤러리 항목" : "제품"} 항목이 없습니다.
            </p>
          </div>
        )}
        {rows.map((entry, index) => {
          const path = `items.${index}`;
          const itemName =
            draftTitles[entry.clientId] ??
            text(gallery ? entry.value.title : entry.value.code);
          const cardTitle = itemName
            ? `${index + 1}. ${itemName}`
            : `${gallery ? "항목" : "제품"} ${index + 1}`;
          return (
            <RepeaterCard
              key={entry.clientId}
              title={cardTitle}
              defaultOpen={newRowIds.has(entry.clientId)}
              onRemove={() => {
                setRows((current) =>
                  current.filter((item) => item.clientId !== entry.clientId),
                );
                onDirty();
              }}
              onDragStart={(event) => beginDrag(event, entry.clientId)}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
              }}
              onDrop={(event) => {
                event.preventDefault();
                reorderRows(
                  event.dataTransfer.getData("text/plain"),
                  entry.clientId,
                );
                setDraggingId(null);
              }}
              onDragEnd={() => setDraggingId(null)}
              dragging={draggingId === entry.clientId}
            >
              {text(entry.value._key) && (
                <input
                  type="hidden"
                  name={name(`${path}._key`)}
                  value={text(entry.value._key)}
                />
              )}
              <input
                type="hidden"
                name={name(`${path}.visible`)}
                value="false"
              />
              <ToggleField
                id={`${path}-visible`}
                label="사이트에 노출"
                name={name(`${path}.visible`)}
                value="true"
                defaultChecked={entry.value.visible !== false}
              />
              <div className="grid gap-4 md:grid-cols-2">
                {gallery ? (
                  <TextField
                    id={`${path}.title`}
                    label="항목명"
                    name={name(`${path}.title`)}
                    defaultValue={text(entry.value.title)}
                    onChange={(event) => {
                      const value = event.currentTarget.value;
                      setDraftTitles((current) => ({
                        ...current,
                        [entry.clientId]: value,
                      }));
                    }}
                    required
                  />
                ) : (
                  <TextField
                    id={`${path}.code`}
                    label="제품명·코드"
                    name={name(`${path}.code`)}
                    defaultValue={text(entry.value.code)}
                    onChange={(event) => {
                      const value = event.currentTarget.value;
                      setDraftTitles((current) => ({
                        ...current,
                        [entry.clientId]: value,
                      }));
                    }}
                    required
                  />
                )}
                <TextField
                  id={`${path}.summary`}
                  label={gallery ? "설명" : "제품 상세 설명"}
                  name={name(`${path}.summary`)}
                  defaultValue={text(entry.value.summary)}
                />
                <AssetPicker
                  path={`${path}.image`}
                  value={entry.value.image}
                  label="이미지"
                />
                {!gallery && (
                  <Strings
                    path={`${path}.points`}
                    label="제품 특징"
                    value={entry.value.points}
                    onDirty={onDirty}
                  />
                )}
              </div>
              {!gallery && (
                <RelatedDocuments
                  path={`${path}.documents`}
                  value={entry.value.documents}
                  options={options}
                  onDirty={onDirty}
                />
              )}
            </RepeaterCard>
          );
        })}
      </div>
    </FormSection>
  );
}

function Lineup({
  type,
  document,
  id,
  options,
  onDirty,
}: {
  readonly type: "productLineup" | "productGallery";
  readonly document: RecordValue;
  readonly id?: string;
  readonly options: readonly DocumentOption[];
  readonly onDirty: () => void;
}) {
  const choices =
    type === "productLineup"
      ? [
          ["release", "RELEASE"],
          ["pranza", "PRANZA"],
        ]
      : [
          ["machine-parts", "사출 부품"],
          ["spray", "스프레이 부품"],
          ["crucible", "용탕 관리제"],
        ];
  return (
    <>
      <FormSection title="기본 정보">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            label="구분 키"
            required
            description="생성 후 변경할 수 없습니다."
          >
            <select
              name={name("key")}
              defaultValue={text(document.key)}
              disabled={Boolean(id)}
              className={controlClassName}
            >
              <option value="">구분을 선택하세요</option>
              {choices.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {id && (
              <input
                type="hidden"
                name={name("key")}
                value={text(document.key)}
              />
            )}
          </FormField>
          <TextField
            id="title"
            label="제목"
            name={name("title")}
            defaultValue={text(document.title)}
            required
          />
          {type === "productLineup" && (
            <TextField
              id="brand"
              label="브랜드명"
              name={name("brand")}
              defaultValue={text(document.brand)}
            />
          )}
          <TextAreaField
            id="intro"
            label="소개 문단"
            name={name("intro")}
            defaultValue={text(document.intro)}
            className="md:col-span-2"
          />
        </div>
        {type === "productLineup" && (
          <div className="mt-5">
            <Strings
              path="bullets"
              label="라인업 특징"
              value={document.bullets}
              onDirty={onDirty}
            />
          </div>
        )}
      </FormSection>
      <ProductItems
        type={type}
        value={document.items}
        options={options}
        onDirty={onDirty}
      />
    </>
  );
}

function Catalog({ document }: { readonly document: RecordValue }) {
  return (
    <FormSection
      title="활성 카탈로그"
      description="카탈로그는 한 개의 활성 문서만 관리합니다."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          id="title"
          label="제목"
          name={name("title")}
          defaultValue={text(document.title)}
          required
        />
        <TextField
          id="tagline"
          label="표지 부제"
          name={name("tagline")}
          defaultValue={text(document.tagline)}
        />
        <div className="md:col-span-2">
          <AssetPicker
            path="file"
            value={document.file}
            label="카탈로그 PDF"
            pdf
          />
        </div>
      </div>
    </FormSection>
  );
}
function Cert({ document }: { readonly document: RecordValue }) {
  return (
    <FormSection title="인증·특허 정보">
      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          id="title"
          label="인증명"
          name={name("title")}
          defaultValue={text(document.title)}
          required
        />
        <TextField
          id="standard"
          label="주요 규격"
          name={name("standard")}
          defaultValue={text(document.standard)}
        />
        <TextField
          id="issuer"
          label="인증기관"
          name={name("issuer")}
          defaultValue={text(document.issuer)}
        />
        <TextField
          id="number"
          label="인증번호"
          name={name("number")}
          defaultValue={text(document.number)}
        />
        <TextField
          id="scope"
          label="인증범위"
          name={name("scope")}
          defaultValue={text(document.scope)}
        />
        <TextField
          id="validity"
          label="유효기간"
          name={name("validity")}
          defaultValue={text(document.validity)}
        />
        <TextAreaField
          id="desc"
          label="설명"
          name={name("desc")}
          defaultValue={text(document.desc)}
          className="md:col-span-2"
        />
        <AssetPicker
          path="imageKo"
          value={document.imageKo}
          label="국문 인증서 이미지"
        />
        <AssetPicker
          path="imageEn"
          value={document.imageEn}
          label="영문 인증서 이미지"
        />
      </div>
    </FormSection>
  );
}

export function CollectionEditor({
  type,
  id,
  revision,
  documentText,
  documentOptions,
}: {
  readonly type: "productLineup" | "productGallery" | "catalog" | "cert";
  readonly id?: string;
  readonly revision?: string;
  readonly documentText: string;
  readonly documentOptions: readonly DocumentOption[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    saveContentActionWithState,
    EMPTY_CONTENT_ACTION_STATE,
  );
  const [dirty, setDirty] = useState(false);
  // 취소로 나갈 때는 이미 확인을 받았으므로 beforeunload 경고를 한 번 더 띄우지 않는다.
  const leavingRef = useRef(false);
  const document = parseDocument(documentText);
  const preview =
    type === "catalog" ? "/catalog" : type === "cert" ? "/cert" : "/products";
  useEffect(() => {
    formRef.current
      ?.querySelector('[name="content.key"]')
      ?.setAttribute("id", "key");
  }, []);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (dirty && !leavingRef.current) event.preventDefault();
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
  return (
    <form
      ref={formRef}
      id="collection-content-form"
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
        저장한 내용은 공개 페이지에 반영됩니다. 필요한 섹션만 펼쳐서 편집할 수
        있습니다.
      </EditorNotice>
      {type === "productLineup" || type === "productGallery" ? (
        <Lineup
          type={type}
          document={document}
          id={id}
          options={documentOptions}
          onDirty={() => setDirty(true)}
        />
      ) : type === "catalog" ? (
        <Catalog document={document} />
      ) : (
        <Cert document={document} />
      )}
      <StickySaveBar
        formId="collection-content-form"
        saving={isPending}
        changed={dirty}
        onCancel={() => {
          if (!dirty || window.confirm("변경한 내용을 버리시겠습니까?")) {
            leavingRef.current = true;
            window.location.assign(`/admin/content/${type}`);
          }
        }}
      />
    </form>
  );
}
