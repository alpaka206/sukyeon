"use client";

import Image, { type ImageLoaderProps } from "next/image";
import { type ChangeEvent, useId, useState } from "react";
import { FormField } from "./AdminFields";

export type ExistingAsset = {
  readonly name: string;
  readonly previewUrl?: string;
};

const imageMimeTypes = ["image/png", "image/jpeg", "image/gif", "image/webp"] as const;

function assetImageLoader({ src }: ImageLoaderProps) {
  return src;
}

function isAllowedFile(kind: "image" | "pdf", file: File) {
  if (kind === "pdf") return file.type === "application/pdf";
  return file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/gif" || file.type === "image/webp";
}

export function AssetField({
  label, name, kind, id, existingAsset, required = false, error, onRemove,
}: {
  readonly label: string;
  readonly name: string;
  readonly kind: "image" | "pdf";
  readonly id?: string;
  readonly existingAsset?: ExistingAsset;
  readonly required?: boolean;
  readonly error?: string;
  readonly onRemove?: () => void;
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [selection, setSelection] = useState("");
  const [validationError, setValidationError] = useState("");
  const displayError = validationError || error;
  const descriptionId = `${inputId}-description`;
  const errorId = displayError ? `${inputId}-error` : undefined;
  const kindLabel = kind === "image" ? "이미지" : "PDF";
  const accept = kind === "image" ? imageMimeTypes.join(",") : "application/pdf";

  function validateFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    if (!file) {
      setSelection("");
      setValidationError(required && !existingAsset ? `${kindLabel} 파일을 선택해 주세요.` : "");
      return;
    }
    if (!isAllowedFile(kind, file)) {
      event.currentTarget.value = "";
      setSelection("");
      setValidationError(kind === "image" ? "PNG, JPEG, GIF, WEBP 이미지만 선택할 수 있습니다." : "PDF 파일만 선택할 수 있습니다.");
      return;
    }
    setSelection(file.name);
    setValidationError("");
  }

  return (
    <FormField label={label} htmlFor={inputId} required={required} description={`${kindLabel}를 선택하면 저장할 때 함께 반영됩니다.`} descriptionId={descriptionId} error={displayError} errorId={errorId} errorLive>
      <div className="rounded-xl border border-dashed border-[#d4dae4] bg-[#fbfcfe] p-4">
        {existingAsset && <div className="mb-3 flex min-h-11 items-center gap-3 rounded-lg border border-[#e2e6ed] bg-white p-2.5">{existingAsset.previewUrl && kind === "image" && <Image loader={assetImageLoader} unoptimized src={existingAsset.previewUrl} alt="현재 이미지 미리보기" width={48} height={48} className="size-12 rounded object-cover" />}<span className="min-w-0 flex-1 truncate text-[14px] font-bold text-[#0a1b33]">현재 파일: {existingAsset.name}</span>{onRemove && <button type="button" onClick={onRemove} className="inline-flex min-h-11 items-center rounded-lg border border-[#d4dae4] px-4 py-2 text-[14px] font-bold text-[#18306f] hover:border-[#22409b] hover:bg-[#eef2fc]">제거</button>}</div>}
        <input id={inputId} name={name} type="file" accept={accept} required={required && !existingAsset} onChange={validateFile} aria-invalid={displayError ? true : undefined} aria-describedby={[descriptionId, errorId].filter(Boolean).join(" ") || undefined} className="block min-h-11 w-full text-[14px] text-[#42526b] file:mr-3 file:min-h-11 file:rounded-lg file:border-0 file:bg-[#eef2fc] file:px-3 file:py-2 file:text-[14px] file:font-bold file:text-[#18306f]" />
        {selection && <p aria-live="polite" className="mt-2 text-[13px] font-semibold text-[#18306f]">선택한 파일: {selection}</p>}
      </div>
    </FormField>
  );
}
