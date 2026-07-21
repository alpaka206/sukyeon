export function readStringList(value: unknown): readonly string[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (typeof entry === "string") return [entry];
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) return [];
    const legacyItem = Reflect.get(entry, "item");
    return typeof legacyItem === "string" ? [legacyItem] : [];
  });
}
