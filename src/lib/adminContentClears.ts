// Sanity 패치의 unset은 `items.0.image`처럼 점으로 이어진 배열 인덱스를 지원하지 않고,
// 한 패치 안에서 set과 unset이 적용되는 순서에도 기대지 않아야 한다.
// 그래서 삭제 요청을 병합된 문서에 직접 반영해 set이 지운 값을 되살리지 못하게 하고,
// set이 건드리지 않는 최상위 필드만 unset 목록으로 돌려준다.

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function pathParts(path: string): readonly string[] {
  return path.replace(/\[(\d+)\]/g, ".$1").split(".").filter(Boolean);
}

function comparePathParts(a: readonly string[], b: readonly string[]): number {
  const length = Math.min(a.length, b.length);
  for (let index = 0; index < length; index += 1) {
    const left = a[index] ?? "";
    const right = b[index] ?? "";
    if (left === right) continue;
    if (/^\d+$/.test(left) && /^\d+$/.test(right)) return Number(left) - Number(right);
    return left < right ? -1 : 1;
  }
  return a.length - b.length;
}

function deleteAtPath(target: Record<string, unknown>, parts: readonly string[]): void {
  const last = parts.at(-1);
  if (!last) return;
  let current: unknown = target;
  for (const part of parts.slice(0, -1)) {
    if (Array.isArray(current)) current = current[Number(part)];
    else if (isRecord(current)) current = current[part];
    else return;
  }
  if (Array.isArray(current) && /^\d+$/.test(last)) current.splice(Number(last), 1);
  else if (isRecord(current)) delete current[last];
}

// 값 삭제만 하고 다른 입력이 없는 행은 폼 인덱스에 구멍(hole)을 남기는데,
// 이대로 직렬화하면 Sanity에 null 원소로 전달된다. 삭제 반영이 끝난 뒤 배열을 압축한다.
export function compactContentArrays(document: Record<string, unknown>): Record<string, unknown> {
  const compacted = compactValue(document);
  return isRecord(compacted) ? compacted : document;
}

function compactValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.filter((entry) => entry !== undefined).map(compactValue);
  if (isRecord(value)) {
    const output: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value)) output[key] = compactValue(nested);
    return output;
  }
  return value;
}

export function applyContentClears(document: Record<string, unknown>, unset: readonly string[]): string[] {
  const topLevel: string[] = [];
  const nested: (readonly string[])[] = [];
  for (const path of unset) {
    const parts = pathParts(path);
    if (parts.length === 1 && parts[0]) topLevel.push(parts[0]);
    else if (parts.length > 1) nested.push(parts);
  }
  // 같은 배열에서 여러 원소를 지울 때 앞 원소를 먼저 지우면 뒤 인덱스가 밀리므로 역순으로 지운다.
  for (const parts of [...nested].sort(comparePathParts).reverse()) deleteAtPath(document, parts);
  for (const key of topLevel) delete document[key];
  return topLevel;
}
