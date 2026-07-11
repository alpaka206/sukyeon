"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { AddRepeaterButton, EditorNotice, FormField, FormSection, RepeaterCard, StickySaveBar, TextAreaField, TextField } from "./FormPrimitives";
import { saveContentAction as saveContentActionWithState } from "../actions";
import { EMPTY_CONTENT_ACTION_STATE } from "./ContentActionState";

type FieldSpec = { readonly key: string; readonly label: string; readonly kind?: "text" | "textarea" | "url" | "select" | "image"; readonly options?: readonly string[]; readonly fields?: readonly FieldSpec[]; readonly array?: FieldSpec };
type ContentRecord = Record<string, unknown>;
type Row = { readonly clientId: string; readonly value: ContentRecord };

function isRecord(value: unknown): value is ContentRecord { return Boolean(value) && typeof value === "object" && !Array.isArray(value); }
function objectAt(value: unknown): ContentRecord { return isRecord(value) ? value : {}; }
function stringAt(value: unknown): string { return typeof value === "string" ? value : ""; }
function rowsAt(value: unknown): readonly ContentRecord[] { return Array.isArray(value) ? value.filter(isRecord) : []; }
function imageRef(value: unknown): string { const asset = objectAt(objectAt(value)["asset"])["_ref"]; return stringAt(asset); }
function inputName(path: string): string { return `content.${path}`; }
function clearName(path: string): string { return `clear.${path}`; }
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
  try { const parsed: unknown = JSON.parse(documentText); return objectAt(parsed); } catch { return {}; }
}

function schemaFor(type: "homePage" | "aboutPage" | "siteSettings"): readonly FieldSpec[] {
  if (type === "homePage") return [
    { key: "hero", label: "첫 화면", fields: [
      { key: "titleLine1", label: "제목 첫 줄" }, { key: "titleLine2", label: "제목 둘째 줄" }, { key: "copyLine1", label: "설명 첫 줄", kind: "textarea" }, { key: "copyLine2", label: "설명 둘째 줄", kind: "textarea" },
      { key: "primaryLabel", label: "주 버튼 문구" }, { key: "primaryHref", label: "주 버튼 링크", kind: "url" }, { key: "secondaryLabel", label: "보조 버튼 문구" }, { key: "secondaryHref", label: "보조 버튼 링크", kind: "url" },
      { key: "slides", label: "슬라이드 이미지", array: { key: "slide", label: "슬라이드", fields: [{ key: "desktopImage", label: "데스크톱 이미지", kind: "image" }, { key: "mobileImage", label: "모바일 이미지", kind: "image" }, { key: "alt", label: "대체 텍스트" }] } },
    ] },
    { key: "productsHeading", label: "제품 소개 제목", fields: [{ key: "eyebrow", label: "영문 레이블" }, { key: "title", label: "제목" }, { key: "moreLabel", label: "더보기 문구" }, { key: "moreHref", label: "더보기 링크", kind: "url" }] },
    { key: "productCards", label: "제품 미리보기 카드", array: { key: "card", label: "제품 카드", fields: [{ key: "image", label: "이미지", kind: "image" }, { key: "title", label: "제목" }, { key: "tag", label: "태그" }, { key: "desc", label: "설명", kind: "textarea" }, { key: "href", label: "링크", kind: "url" }] } },
    { key: "productsCta", label: "제품 CTA", fields: [{ key: "title", label: "제목", kind: "textarea" }, { key: "desc", label: "설명" }, { key: "label", label: "버튼 문구" }, { key: "href", label: "버튼 링크", kind: "url" }] },
    { key: "whyHeading", label: "선택 이유 제목", fields: [{ key: "eyebrow", label: "영문 레이블" }, { key: "title", label: "제목" }] },
    { key: "whyItems", label: "선택 이유", array: { key: "reason", label: "선택 이유", fields: [{ key: "icon", label: "아이콘", kind: "select", options: ["manufacturing", "quality", "delivery", "support"] }, { key: "title", label: "제목" }, { key: "desc", label: "설명", kind: "textarea" }] } },
    { key: "contactCta", label: "문의 CTA", fields: [{ key: "title", label: "제목", kind: "textarea" }, { key: "desc", label: "설명" }, { key: "primaryLabel", label: "주 버튼 문구" }, { key: "primaryHref", label: "주 버튼 링크", kind: "url" }, { key: "phoneLabel", label: "전화 버튼 문구" }, { key: "phoneHref", label: "전화 링크", kind: "url" }] },
  ];
  if (type === "aboutPage") return [
    { key: "greeting", label: "인사말", fields: [{ key: "heading", label: "제목", kind: "textarea" }, { key: "paragraphs", label: "본문 문단", array: { key: "paragraph", label: "문단", kind: "textarea" } }, { key: "signName", label: "서명 이름" }, { key: "signLabel", label: "서명 직함" }, { key: "image", label: "이미지", kind: "image" }] },
    { key: "info", label: "회사 소개", fields: [{ key: "heading", label: "제목", kind: "textarea" }, { key: "paragraphs", label: "본문 문단", array: { key: "paragraph", label: "문단", kind: "textarea" } }, { key: "image", label: "이미지", kind: "image" }, { key: "values", label: "핵심 가치", array: { key: "value", label: "핵심 가치", fields: [{ key: "no", label: "번호" }, { key: "title", label: "제목" }, { key: "desc", label: "설명", kind: "textarea" }] } }] },
    { key: "equipment", label: "설비 현황", fields: [{ key: "desc", label: "설명", kind: "textarea" }, { key: "rows", label: "설비 목록", array: { key: "equipment", label: "설비", fields: [{ key: "no", label: "구분" }, { key: "name", label: "설비명" }, { key: "cap", label: "설비 용량" }] } }] },
    { key: "history", label: "연혁", fields: [{ key: "desc", label: "설명", kind: "textarea" }, { key: "entries", label: "연혁 항목", array: { key: "history", label: "연혁", fields: [{ key: "year", label: "연도" }, { key: "lines", label: "내용", array: { key: "line", label: "내용" } }] } }] },
    { key: "location", label: "오시는 길", fields: [{ key: "mapNote", label: "지도 안내 문구" }] },
  ];
  return [
    { key: "logo", label: "헤더 로고", kind: "image" },
    { key: "company", label: "회사 정보", fields: [{ key: "name", label: "상호" }, { key: "nameEn", label: "영문 상호" }, { key: "ceo", label: "대표" }, { key: "address", label: "주소" }, { key: "tel", label: "전화" }, { key: "fax", label: "팩스" }, { key: "email", label: "이메일" }, { key: "bizNo", label: "사업자등록번호" }, { key: "hours", label: "영업시간" }, { key: "blog", label: "블로그 URL", kind: "url" }] },
    { key: "nav", label: "상단 메뉴", array: { key: "menu", label: "메뉴", fields: [{ key: "label", label: "문구" }, { key: "href", label: "링크", kind: "url" }, { key: "children", label: "하위 메뉴", array: { key: "child", label: "하위 메뉴", fields: [{ key: "label", label: "문구" }, { key: "href", label: "링크", kind: "url" }] } }] } },
    { key: "footerTagline", label: "푸터 소개 문구", kind: "textarea" },
    { key: "footerColumns", label: "푸터 링크 열", array: { key: "column", label: "푸터 열", fields: [{ key: "title", label: "열 제목" }, { key: "links", label: "링크", array: { key: "link", label: "링크", fields: [{ key: "label", label: "문구" }, { key: "href", label: "링크", kind: "url" }] } }] } },
  ];
}

function AssetControl({ label, path, value }: { readonly label: string; readonly path: string; readonly value: unknown }) {
  const [cleared, setCleared] = useState(false);
  const [selectedName, setSelectedName] = useState("");
  const ref = imageRef(value);
  const status = cleared ? "저장 시 현재 이미지를 삭제합니다." : selectedName ? `새 파일: ${selectedName}` : ref ? "현재 이미지가 유지됩니다." : "등록된 이미지가 없습니다.";

  return (
    <FormField label={label} description="파일은 저장을 누를 때만 업로드됩니다.">
      <div className="rounded-2xl border border-dashed border-[#b8c5da] bg-[#fbfcfe] p-4 transition-colors duration-150 focus-within:border-[#22409b] focus-within:bg-white">
        <p className="mb-3 inline-flex rounded-lg bg-white px-3 py-1.5 text-[13px] font-bold text-[#42526b] ring-1 ring-[#e2e6ed]">{status}</p>
        <input name={`asset.${path}`} type="file" accept="image/png,image/jpeg,image/gif,image/webp" disabled={cleared} onChange={(event) => setSelectedName(event.currentTarget.files?.[0]?.name ?? "")} className="block min-h-11 w-full text-[14px] text-[#42526b] file:mr-3 file:min-h-11 file:rounded-lg file:border-0 file:bg-[#eef2fc] file:px-3 file:py-2 file:text-[14px] file:font-bold file:text-[#18306f] disabled:opacity-50" />
        {cleared && <input type="hidden" name={clearName(path)} value="true" />}
        <label className="mt-3 flex min-h-11 items-center gap-2 rounded-lg px-1 text-[14px] font-bold text-[#5a6680]">
          <input type="checkbox" checked={cleared} onChange={(event) => setCleared(event.currentTarget.checked)} className="size-4 accent-[#22409b]" />
          이미지 삭제
        </label>
      </div>
    </FormField>
  );
}

function Leaf({ spec, path, value }: { readonly spec: FieldSpec; readonly path: string; readonly value: unknown }) {
  const [cleared, setCleared] = useState(false);
  if (spec.kind === "image") return <AssetControl label={spec.label} path={path} value={value} />;
  const clearControl = <label className="mt-2 flex items-center gap-2 text-[13px] font-semibold text-[#5a6680]"><input type="checkbox" checked={cleared} onChange={(event) => setCleared(event.currentTarget.checked)} />값 삭제</label>;
  if (cleared) return <FormField label={spec.label}><input type="hidden" name={clearName(path)} value="true" />{clearControl}</FormField>;
  if (spec.kind === "textarea") return <div><TextAreaField id={path} label={spec.label} name={inputName(path)} defaultValue={stringAt(value)} />{clearControl}</div>;
  if (spec.kind === "select") return <div><FormField label={spec.label} htmlFor={path}><select id={path} name={inputName(path)} defaultValue={stringAt(value)} className="min-h-11 w-full rounded-lg border border-[#d4dae4] px-3">{spec.options?.map((option) => <option key={option} value={option}>{option}</option>)}</select></FormField>{clearControl}</div>;
  return <div><TextField id={path} label={spec.label} name={inputName(path)} type={spec.kind === "url" ? "url" : "text"} defaultValue={stringAt(value)} />{clearControl}</div>;
}

function ArrayEditor({ spec, path, value }: { readonly spec: FieldSpec; readonly path: string; readonly value: unknown }) {
  const [rows, setRows] = useState<readonly Row[]>(() => rowsAt(value).map((entry) => ({ clientId: crypto.randomUUID(), value: entry })));
  useArrayMarker(path);
  const move = (from: number, direction: number) => setRows((current) => { const target = from + direction; if (target < 0 || target >= current.length) return current; const next = [...current]; const picked = next[from]; const replacement = next[target]; if (!picked || !replacement) return current; next[from] = replacement; next[target] = picked; return next; });
  const item = spec.array; if (!item) return null;
  return <div className="grid gap-3"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="m-0 text-[15px] font-extrabold text-[#0a1b33]">{spec.label}</h3><AddRepeaterButton label={spec.label} onClick={() => setRows((current) => [...current, { clientId: crypto.randomUUID(), value: {} }])} /></div>{rows.length === 0 && <p className="m-0 rounded-xl border border-[#e2e6ed] bg-[#fbfcfe] px-4 py-3 text-[13px] font-semibold text-[#8a96ab]">아직 등록된 항목이 없습니다.</p>}{rows.map((row, index) => { const existingKey = stringAt(row.value["_key"]); return <RepeaterCard key={row.clientId} title={`${item.label} ${index + 1}`} onRemove={() => setRows((current) => current.filter((entry) => entry.clientId !== row.clientId))} onMoveUp={() => move(index, -1)} onMoveDown={() => move(index, 1)} moveUpDisabled={index === 0} moveDownDisabled={index === rows.length - 1}>{existingKey && <input type="hidden" name={inputName(`${path}.${index}._key`)} value={existingKey} />}{item.fields ? <Fields specs={item.fields} path={`${path}.${index}`} value={row.value} /> : <Leaf spec={item} path={`${path}.${index}`} value={row.value} />}</RepeaterCard>; })}</div>;
}

function Fields({ specs, path, value }: { readonly specs: readonly FieldSpec[]; readonly path: string; readonly value: ContentRecord }) { return <div className="grid gap-4 md:grid-cols-2">{specs.map((spec) => { const nextPath = path ? `${path}.${spec.key}` : spec.key; const nextValue = value[spec.key]; if (spec.array) return <div key={nextPath} className="md:col-span-2"><ArrayEditor spec={spec} path={nextPath} value={nextValue} /></div>; if (spec.fields) return <div key={nextPath} className="md:col-span-2"><FormSection title={spec.label} defaultOpen><Fields specs={spec.fields} path={nextPath} value={objectAt(nextValue)} /></FormSection></div>; return <Leaf key={nextPath} spec={spec} path={nextPath} value={nextValue} />; })}</div>; }

export function SingletonEditor({ type, id, revision, documentText }: { readonly type: "homePage" | "aboutPage" | "siteSettings"; readonly id?: string; readonly revision?: string; readonly documentText: string }) {
  const formRef = useRef<HTMLFormElement>(null); const [state, formAction] = useActionState(saveContentActionWithState, EMPTY_CONTENT_ACTION_STATE); const [dirty, setDirty] = useState(false); const [resetVersion, setResetVersion] = useState(0); const document = initialDocument(documentText); const preview = type === "homePage" ? "/" : type === "aboutPage" ? "/about" : "/";
  async function saveContentAction(formData: FormData): Promise<void> { startTransition(() => formAction(formData)); }
  useEffect(() => { const warn = (event: BeforeUnloadEvent) => { if (dirty) event.preventDefault(); }; window.addEventListener("beforeunload", warn); return () => window.removeEventListener("beforeunload", warn); }, [dirty]);
  useEffect(() => { const form = formRef.current; if (!form) return; form.querySelector("[data-action-feedback]")?.remove(); const firstError = state.errors[0]; if (!firstError) return; const summary = window.document.createElement("section"); summary.dataset.actionFeedback = "true"; summary.setAttribute("role", "alert"); summary.className = "rounded-xl border border-[#f0c9c9] bg-[#fff5f5] p-4 text-[#7f1d1d]"; const title = window.document.createElement("h2"); title.className = "m-0 text-[16px] font-extrabold"; title.textContent = "저장 내용을 확인해 주세요"; const link = window.document.createElement("a"); link.href = `#${firstError.field}`; link.className = "mt-2 block text-[14px] font-semibold underline"; link.textContent = firstError.message; summary.append(title, link); form.prepend(summary); window.document.getElementById(firstError.field)?.focus(); }, [state.errors]);
  function discard() { if (!dirty || window.confirm("변경한 내용을 버리시겠습니까?")) { formRef.current?.reset(); setResetVersion((current) => current + 1); setDirty(false); } }
  return <form ref={formRef} id="singleton-content-form" action={saveContentAction} onInput={() => setDirty(true)} className="grid gap-5"><input type="hidden" name="type" value={type} />{id && <input type="hidden" name="id" value={id} />}{revision && <input type="hidden" name="revision" value={revision} />}<EditorNotice href={preview}>모든 항목은 저장 후 공개 페이지에 반영됩니다. 긴 설정 묶음은 섹션을 접어서 필요한 영역만 편집할 수 있습니다.</EditorNotice><Fields key={resetVersion} specs={schemaFor(type)} path="" value={document} /><StickySaveBar formId="singleton-content-form" changed={dirty} onCancel={discard} /></form>;
}
