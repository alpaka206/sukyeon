"use client";

import {
  type ComponentPropsWithoutRef,
  type ReactNode,
  useId,
} from "react";

export type FormFieldProps = {
  readonly label: string;
  readonly children: ReactNode;
  readonly description?: string;
  readonly descriptionId?: string;
  readonly error?: string;
  readonly errorId?: string;
  readonly errorLive?: boolean;
  readonly htmlFor?: string;
  readonly required?: boolean;
};

export const controlClassName =
  "min-h-11 w-full rounded-xl border border-[#d4dae4] bg-white px-3.5 py-2.5 text-[15px] text-[#0a1b33] outline-none transition-[background,border-color,box-shadow] duration-150 placeholder:text-[#8a96ab] hover:border-[#b8c5da] focus:border-[#22409b] focus:bg-white focus:ring-2 focus:ring-[#eef2fc]";

function combinedDescribedBy(
  descriptionId: string | undefined,
  errorId: string | undefined,
  describedBy: string | undefined,
) {
  return [describedBy, descriptionId, errorId].filter(Boolean).join(" ") || undefined;
}

export function FormField({
  label,
  children,
  description,
  descriptionId,
  error,
  errorId,
  errorLive = false,
  htmlFor,
  required = false,
}: FormFieldProps) {
  return (
    <div className="min-w-0">
      <label htmlFor={htmlFor} className="mb-1.5 flex items-center gap-2 text-[13px] font-extrabold leading-5 text-[#18306f]">
        {label}
        {required && <span className="rounded-md bg-[#fff5f5] px-1.5 py-0.5 text-[11px] text-[#b3261e]">필수</span>}
      </label>
      {description && <p id={descriptionId} className="mb-2 text-[13px] leading-5 text-[#5a6680]">{description}</p>}
      {children}
      {error && <p id={errorId} aria-live={errorLive ? "polite" : undefined} className="mt-1.5 text-[13px] font-semibold text-[#b3261e]">{error}</p>}
    </div>
  );
}

type TextFieldProps = ComponentPropsWithoutRef<"input"> & Omit<FormFieldProps, "children" | "htmlFor" | "errorId" | "descriptionId">;

export function TextField({
  label, description, error, required, id, className, "aria-describedby": describedBy, ...props
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <FormField label={label} description={description} descriptionId={descriptionId} error={error} errorId={errorId} htmlFor={inputId} required={required}>
      <input id={inputId} required={required} aria-invalid={error ? true : undefined} aria-describedby={combinedDescribedBy(descriptionId, errorId, describedBy)} className={`${controlClassName} ${className ?? ""}`} {...props} />
    </FormField>
  );
}

type TextAreaFieldProps = ComponentPropsWithoutRef<"textarea"> & Omit<FormFieldProps, "children" | "htmlFor" | "errorId" | "descriptionId">;

export function TextAreaField({
  label, description, error, required, id, className, "aria-describedby": describedBy, ...props
}: TextAreaFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <FormField label={label} description={description} descriptionId={descriptionId} error={error} errorId={errorId} htmlFor={inputId} required={required}>
      <textarea id={inputId} required={required} aria-invalid={error ? true : undefined} aria-describedby={combinedDescribedBy(descriptionId, errorId, describedBy)} className={`${controlClassName} min-h-32 resize-y leading-6 ${className ?? ""}`} {...props} />
    </FormField>
  );
}

type ToggleFieldProps = Omit<ComponentPropsWithoutRef<"input">, "type"> & Pick<FormFieldProps, "label" | "description" | "error">;

export function ToggleField({
  label, description, error, id, "aria-describedby": describedBy, ...props
}: ToggleFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="rounded-xl border border-[#e2e6ed] bg-[#fbfcfe] p-3 transition-colors duration-150 focus-within:border-[#22409b] focus-within:bg-white">
      <label htmlFor={inputId} className="flex min-h-11 cursor-pointer items-center justify-between gap-4 text-[15px] font-extrabold text-[#0a1b33]">
        <span>{label}</span>
        <span className="relative inline-flex h-7 w-12 shrink-0 items-center rounded-full bg-[#d4dae4] p-1 transition-colors duration-150 has-[:checked]:bg-[#22409b]">
          <input id={inputId} type="checkbox" aria-invalid={error ? true : undefined} aria-describedby={combinedDescribedBy(descriptionId, errorId, describedBy)} className="peer sr-only" {...props} />
          <span className="size-5 rounded-full bg-white shadow-[0_2px_8px_-2px_rgba(10,27,51,0.45)] transition-transform duration-150 peer-checked:translate-x-5" />
        </span>
      </label>
      {description && <p id={descriptionId} className="mt-1 text-[13px] leading-5 text-[#5a6680]">{description}</p>}
      {error && <p id={errorId} className="mt-1.5 text-[13px] font-semibold text-[#b3261e]">{error}</p>}
    </div>
  );
}
