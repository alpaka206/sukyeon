import { normalizeContentUrl } from "./adminUrl";

// 관리자 콘텐츠 폼의 파싱·병합·검증 로직(순수 함수).
// Sanity 접근이 필요한 조회 함수는 server-only인 adminContent.ts에 있다.

type ContentValue = string | number | boolean | ContentValue[] | { readonly [key: string]: ContentValue };

type FormField = {
  readonly kind: "string" | "number" | "boolean" | "url" | "image" | "file" | "reference" | "object" | "array";
  readonly required?: boolean;
  readonly values?: readonly string[];
  readonly fields?: Readonly<Record<string, FormField>>;
  readonly item?: FormField;
};

const stringField: FormField = { kind: "string" };
const urlField: FormField = { kind: "url" };
const imageField: FormField = { kind: "image" };
const numberField: FormField = { kind: "number" };
const boolField: FormField = { kind: "boolean" };
const object = (fields: Readonly<Record<string, FormField>>): FormField => ({ kind: "object", fields });
const array = (item: FormField): FormField => ({ kind: "array", item });
const required = (field: FormField): FormField => ({ ...field, required: true });

const link = object({ label: stringField, href: urlField });
const productDocument = object({ label: stringField, doc: { kind: "reference" }, href: urlField });
const formSchemas: Readonly<Record<string, FormField>> = {
  homePage: object({
    hero: object({ titleLine1: stringField, titleLine2: stringField, copyLine1: stringField, copyLine2: stringField, primaryLabel: stringField, primaryHref: urlField, secondaryLabel: stringField, secondaryHref: urlField, slides: array(object({ desktopImage: imageField, mobileImage: imageField, alt: stringField })) }),
    productsHeading: object({ title: stringField, moreLabel: stringField, moreHref: urlField }),
    productCards: array(object({ image: imageField, title: stringField, tag: stringField, desc: stringField, href: urlField })),
    productsCta: object({ title: stringField, desc: stringField, label: stringField, href: urlField }),
    whyHeading: object({ title: stringField }),
    whyItems: array(object({ icon: { kind: "string", values: ["manufacturing", "quality", "delivery", "support"] }, title: stringField, desc: stringField })),
    contactCta: object({ title: stringField, desc: stringField, primaryLabel: stringField, primaryHref: urlField, phoneLabel: stringField, phoneHref: urlField }),
  }),
  aboutPage: object({
    greeting: object({ heading: stringField, paragraphs: array(stringField), signName: stringField, signLabel: stringField, image: imageField }),
    info: object({ heading: stringField, paragraphs: array(stringField), image: imageField, values: array(object({ no: stringField, title: stringField, desc: stringField })) }),
    equipment: object({ desc: stringField, rows: array(object({ no: stringField, name: stringField, cap: stringField })) }),
    history: object({ desc: stringField, entries: array(object({ year: stringField, lines: array(stringField) })) }),
    location: object({ mapNote: stringField }),
  }),
  siteSettings: object({
    logo: imageField,
    company: object({ name: stringField, nameEn: stringField, ceo: stringField, address: stringField, tel: stringField, fax: stringField, email: stringField, bizNo: stringField, hours: stringField, blog: urlField }),
    nav: array(object({ label: stringField, href: urlField, children: array(link) })),
    footerTagline: stringField,
    footerColumns: array(object({ title: stringField, links: array(link) })),
  }),
  productLineup: object({
    key: required({ kind: "string", values: ["release", "pranza"] }), title: required(stringField), brand: stringField, intro: stringField, bullets: array(stringField),
    items: array(object({ visible: boolField, code: required(stringField), image: imageField, summary: stringField, points: array(stringField), documents: array(productDocument) })), order: numberField,
  }),
  productGallery: object({
    key: required({ kind: "string", values: ["machine-parts", "spray", "crucible"] }), title: required(stringField), intro: stringField,
    items: array(object({ visible: boolField, image: imageField, title: required(stringField), summary: stringField })), order: numberField,
  }),
  cert: object({ title: required(stringField), standard: stringField, desc: stringField, issuer: stringField, number: stringField, scope: stringField, validity: stringField, imageKo: imageField, imageEn: imageField, order: numberField }),
};

export type ParsedContentForm = {
  readonly fields: Record<string, ContentValue>;
  readonly unset: readonly string[];
  readonly documentReferences: readonly string[];
  readonly errors: readonly string[];
};

export function setContentFormAssetReference(
  fields: ParsedContentForm["fields"],
  path: string,
  kind: "image" | "file",
  assetId: string,
): void {
  const parts = pathParts(path);
  if (!parts.length || !hasSafeArrayIndexes(parts)) throw new Error("Invalid asset field path");
  put(fields, parts, kind === "image"
    ? { _type: "image", asset: { _type: "reference", _ref: assetId } }
    : { _type: "file", asset: { _type: "reference", _ref: assetId } });
}

const IMAGE_ASSET_ID = /^image-[a-z0-9-]+$/i;
const FILE_ASSET_ID = /^file-[a-z0-9-]+$/i;
const REF_ID = /^[a-zA-Z0-9][a-zA-Z0-9_.-]*$/;
const ARRAY_KEY = /^[a-zA-Z0-9_-]{1,128}$/;
const MAX_ARRAY_INDEX = 99;
const MAX_ARRAY_DEPTH = 3;

function pathParts(path: string): readonly string[] {
  return path.replace(/\[(\d+)\]/g, ".$1").split(".").filter(Boolean);
}

function hasSafeArrayIndexes(parts: readonly string[]): boolean {
  const indexes = parts.filter((part) => /^\d+$/.test(part));
  return indexes.length <= MAX_ARRAY_DEPTH && indexes.every((part) => Number(part) <= MAX_ARRAY_INDEX);
}

function fieldAt(root: FormField, parts: readonly string[]): FormField | null {
  let current: FormField | null = root;
  for (const part of parts) {
    if (!current) return null;
    if (current.kind === "object") {
      current = current.fields?.[part] ?? null;
    } else if (current.kind === "array" && /^\d+$/.test(part)) {
      current = current.item ?? null;
    } else return null;
  }
  return current;
}

export function contentAssetKind(type: ContentType, path: string): "image" | "file" | null {
  const schema = formSchemas[type];
  if (!schema) return null;
  const field = fieldAt(schema, pathParts(path));
  return field?.kind === "image" || field?.kind === "file" ? field.kind : null;
}

function isArrayItemKey(root: FormField, parts: readonly string[]): boolean {
  let current: FormField | null = root;
  let enteredArrayItem = false;
  for (const part of parts.slice(0, -1)) {
    if (!current) return false;
    if (current.kind === "object") current = current.fields?.[part] ?? null;
    else if (current.kind === "array" && /^\d+$/.test(part)) {
      current = current.item ?? null;
      enteredArrayItem = true;
    } else return false;
  }
  return enteredArrayItem && current?.kind === "object";
}

function put(target: Record<string, ContentValue>, parts: readonly string[], value: ContentValue): void {
  const [head, ...tail] = parts;
  if (!head) return;
  if (tail.length === 0) {
    target[head] = value;
    return;
  }
  const next = target[head];
  const numeric = /^\d+$/.test(tail[0] ?? "");
  if (numeric) {
    const values = Array.isArray(next) ? next : [];
    const index = Number(tail[0]);
    if (tail.length === 1) {
      // 문자열 목록처럼 배열 원소 자체가 leaf인 경우 — 값을 그대로 넣는다.
      values[index] = value;
    } else {
      const entry = values[index];
      const child = entry && typeof entry === "object" && !Array.isArray(entry) ? entry : {};
      put(child, tail.slice(1), value);
      values[index] = child;
    }
    target[head] = values;
    return;
  }
  const child = next && typeof next === "object" && !Array.isArray(next) ? next : {};
  put(child, tail, value);
  target[head] = child;
}

function valueFor(field: FormField, raw: FormDataEntryValue): ContentValue | null {
  if (typeof raw !== "string") return null;
  const value = raw.trim();
  if (field.kind === "string") return field.values && !field.values.includes(value) ? null : value;
  if (field.kind === "url") return normalizeContentUrl(value);
  if (field.kind === "number") {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
  }
  if (field.kind === "boolean") return value === "true" || value === "on" ? true : value === "false" || value === "" ? false : null;
  if (field.kind === "reference") return REF_ID.test(value) ? { _type: "reference", _ref: value } : null;
  if (field.kind === "image") return IMAGE_ASSET_ID.test(value) ? { _type: "image", asset: { _type: "reference", _ref: value } } : null;
  if (field.kind === "file") return FILE_ASSET_ID.test(value) ? { _type: "file", asset: { _type: "reference", _ref: value } } : null;
  return null;
}

function findDocumentReferences(value: ContentValue, output: string[]): void {
  if (Array.isArray(value)) {
    for (const entry of value) findDocumentReferences(entry, output);
  } else if (typeof value === "object") {
    if (value._type === "reference" && typeof value._ref === "string" && !IMAGE_ASSET_ID.test(value._ref) && !FILE_ASSET_ID.test(value._ref)) output.push(value._ref);
    for (const nested of Object.values(value)) findDocumentReferences(nested, output);
  }
}

function materializeBooleanDefaults(field: FormField, value: ContentValue): ContentValue {
  if (field.kind === "array" && field.item && Array.isArray(value)) {
    return value.map((entry) => materializeBooleanDefaults(field.item ?? stringField, entry));
  }
  if (field.kind !== "object" || !field.fields || !isRecord(value)) return value;
  const output: Record<string, ContentValue> = {};
  for (const [key, nested] of Object.entries(value)) {
    const child = field.fields[key];
    output[key] = child ? materializeBooleanDefaults(child, toContentValue(nested)) : toContentValue(nested);
  }
  for (const [key, child] of Object.entries(field.fields)) {
    const isExistingRow = typeof output._key === "string" && Boolean(output._key);
    if (child.kind === "boolean" && output[key] === undefined && !isExistingRow) output[key] = true;
  }
  return output;
}

function toContentValue(value: unknown): ContentValue {
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return value;
  if (Array.isArray(value)) return value.map(toContentValue);
  if (isRecord(value)) {
    const output: Record<string, ContentValue> = {};
    for (const [key, nested] of Object.entries(value)) output[key] = toContentValue(nested);
    return output;
  }
  return "";
}

function isContentObject(value: ContentValue): value is Record<string, ContentValue> {
  return typeof value === "object" && !Array.isArray(value);
}

function arrayMarkerPath(name: string, raw: FormDataEntryValue, schema: FormField): readonly string[] | null {
  if (!name.startsWith("array.") || raw !== "replace") return null;
  const parts = pathParts(name.slice("array.".length));
  if (!parts.length || !hasSafeArrayIndexes(parts)) return null;
  return fieldAt(schema, parts)?.kind === "array" ? parts : null;
}

export function parseContentForm(type: ContentType, formData: FormData): ParsedContentForm {
  const schema = formSchemas[type];
  const fields: Record<string, ContentValue> = {};
  const unset: string[] = [];
  const errors: string[] = [];
  // 마커는 얕은 경로부터 적용한다. React effect가 자식→부모 순으로 실행돼 FormData에는
  // 중첩 마커가 먼저 오는데, 그대로 적용하면 부모 마커의 빈 배열이 중첩 마커를 덮어써
  // "중첩 배열 전체 삭제"가 기존 값 유지로 둔갑한다.
  const markers: (readonly string[])[] = [];
  for (const [name, raw] of formData.entries()) {
    const parts = arrayMarkerPath(name, raw, schema);
    if (parts) markers.push(parts);
  }
  markers.sort((a, b) => a.length - b.length);
  for (const parts of markers) put(fields, parts, []);
  for (const [name, raw] of formData.entries()) {
    if (name.startsWith("content.")) {
      const parts = pathParts(name.slice("content.".length));
      if (!hasSafeArrayIndexes(parts)) {
        errors.push(`유효하지 않은 배열 인덱스: ${name}`);
        continue;
      }
      const isKey = parts.at(-1) === "_key" && isArrayItemKey(schema, parts);
      const field = isKey ? null : fieldAt(schema, parts);
      const value = isKey && typeof raw === "string" && ARRAY_KEY.test(raw) ? raw : field ? valueFor(field, raw) : null;
      if ((!field && !isKey) || value === null) errors.push(`유효하지 않은 입력: ${name}`);
      else put(fields, parts, value);
    }
    if (name.startsWith("clear.") && raw === "true") {
      const parts = pathParts(name.slice("clear.".length));
      if (!hasSafeArrayIndexes(parts)) {
        errors.push(`유효하지 않은 배열 인덱스: ${name}`);
        continue;
      }
      const field = fieldAt(schema, parts);
      if (!field || field.required || field.kind === "object" || field.kind === "array" || field.kind === "boolean") errors.push(`지울 수 없는 입력: ${name}`);
      else unset.push(parts.join("."));
    }
  }
  const materialized = materializeBooleanDefaults(schema, fields);
  const parsedFields = isContentObject(materialized) ? materialized : fields;
  const documentReferences: string[] = [];
  findDocumentReferences(parsedFields, documentReferences);
  return { fields: parsedFields, unset, documentReferences, errors };
}

function hasRequiredValue(value: unknown): boolean {
  return typeof value === "string" ? Boolean(value.trim()) : value !== undefined && value !== null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function mergeContentFormArray(existing: readonly unknown[], fields: readonly unknown[]): unknown[] {
  return fields.map((entry) => {
    if (!isRecord(entry) || typeof entry._key !== "string") return entry;
    const prior = existing.find((candidate) => isRecord(candidate) && candidate._key === entry._key);
    return isRecord(prior) ? mergeContentFormFields(prior, entry) : entry;
  });
}

export function mergeContentFormFields(existing: Record<string, unknown>, fields: Record<string, unknown>): Record<string, unknown> {
  const merged: Record<string, unknown> = { ...existing };
  for (const [key, value] of Object.entries(fields)) {
    const prior = existing[key];
    if (Array.isArray(value) && Array.isArray(prior)) merged[key] = mergeContentFormArray(prior, value);
    else if (isRecord(value) && isRecord(prior)) merged[key] = mergeContentFormFields(prior, value);
    else merged[key] = value;
  }
  return merged;
}

export function normalizeProductDocumentLinks(document: Record<string, unknown>, submitted: Record<string, unknown>): void {
  const documentItems = document.items;
  const submittedItems = submitted.items;
  if (!Array.isArray(documentItems) || !Array.isArray(submittedItems)) return;

  for (let itemIndex = 0; itemIndex < submittedItems.length; itemIndex += 1) {
    const documentItem = documentItems[itemIndex];
    const submittedItem = submittedItems[itemIndex];
    if (!isRecord(documentItem) || !isRecord(submittedItem) || !Array.isArray(documentItem.documents) || !Array.isArray(submittedItem.documents)) continue;
    for (let documentIndex = 0; documentIndex < submittedItem.documents.length; documentIndex += 1) {
      const documentRow = documentItem.documents[documentIndex];
      const submittedRow = submittedItem.documents[documentIndex];
      if (!isRecord(documentRow) || !isRecord(submittedRow)) continue;
      if ("doc" in submittedRow && submittedRow.href === "") delete documentRow.href;
      else if ("href" in submittedRow && !("doc" in submittedRow)) delete documentRow.doc;
    }
  }
}

function validationErrors(field: FormField, value: unknown, path: string, errors: string[]): void {
  if (field.required && !hasRequiredValue(value)) errors.push(`필수 입력: ${path}`);
  if (field.kind === "object" && field.fields && isRecord(value)) {
    const record = value;
    for (const [key, child] of Object.entries(field.fields)) validationErrors(child, record[key], path ? `${path}.${key}` : key, errors);
  }
  if (field.kind === "array" && field.item && Array.isArray(value)) {
    value.forEach((entry, index) => validationErrors(field.item ?? stringField, entry, `${path}[${index}]`, errors));
  }
  if (field === productDocument && isRecord(value)) {
    const record = value;
    const hasDoc = isRecordWithString(record.doc, "_ref");
    const hasHref = typeof record.href === "string" && Boolean(record.href.trim());
    if (hasDoc === hasHref) errors.push(`자료 연결은 문서 또는 직접 링크 중 하나만 선택해야 합니다: ${path}`);
  }
}

function isRecordWithString(value: unknown, key: string): boolean {
  return isRecord(value) && typeof value[key] === "string";
}

export function contentValidationErrors(type: ContentType, document: Record<string, unknown>): readonly string[] {
  const schema = formSchemas[type];
  if (!schema) return ["지원하지 않는 콘텐츠 유형입니다."];
  const errors: string[] = [];
  validationErrors(schema, document, "", errors);
  return errors;
}

export const CONTENT_TYPES = [
  "homePage",
  "aboutPage",
  "siteSettings",
  "productLineup",
  "productGallery",
  "doc",
  "cert",
] as const;

export type ContentType = (typeof CONTENT_TYPES)[number];

export const FORM_CONTENT_TYPES = [
  "homePage",
  "aboutPage",
  "siteSettings",
  "productLineup",
  "productGallery",
  "cert",
] as const satisfies readonly ContentType[];

export type FormContentType = (typeof FORM_CONTENT_TYPES)[number];

const CONTENT_TYPE_SET = new Set<string>(CONTENT_TYPES);
const FORM_CONTENT_TYPE_SET = new Set<string>(FORM_CONTENT_TYPES);

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  homePage: "홈페이지",
  aboutPage: "회사소개",
  siteSettings: "사이트 설정",
  productLineup: "제품 라인업",
  productGallery: "제품 갤러리",
  doc: "자료실",
  cert: "인증·특허",
};

export const SINGLETON_DOCUMENT_IDS: Partial<Record<ContentType, string>> = {
  homePage: "homePage",
  aboutPage: "aboutPage",
  siteSettings: "siteSettings",
};

export function isContentType(value: string): value is ContentType {
  return CONTENT_TYPE_SET.has(value);
}

export function isFormContentType(value: ContentType): value is FormContentType {
  return FORM_CONTENT_TYPE_SET.has(value);
}

export function contentDocumentTitle(document: Record<string, unknown>, fallback: string): string {
  for (const field of ["title", "name", "key"] as const) {
    const value = document[field];
    if (typeof value === "string" && value.trim()) return value;
  }
  return fallback;
}
