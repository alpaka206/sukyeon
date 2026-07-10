import { redirect } from "next/navigation";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default async function StudioPage() {
  redirect("/admin/content");
}
