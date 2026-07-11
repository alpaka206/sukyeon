"use client";

import type { FormContentType } from "@/lib/adminContent";
import { CollectionEditor } from "./CollectionEditor";
import { SingletonEditor } from "./SingletonEditor";

type DocumentOption = { readonly id: string; readonly title: string };

export default function ContentEditor({
  type, id, revision, documentText, documentOptions = [],
}: {
  readonly type: FormContentType;
  readonly id?: string;
  readonly revision?: string;
  readonly documentText: string;
  readonly documentOptions?: readonly DocumentOption[];
}) {
  if (type === "homePage" || type === "aboutPage" || type === "siteSettings") {
    return <SingletonEditor type={type} id={id} revision={revision} documentText={documentText} />;
  }

  return <CollectionEditor type={type} id={id} revision={revision} documentText={documentText} documentOptions={documentOptions} />;
}
