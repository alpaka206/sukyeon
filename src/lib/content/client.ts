import { sanityClient } from "../sanity";

export type ContentRequest<T> = (query: string) => Promise<T>;

export function configuredRequest<T>(): ContentRequest<T> | null {
  const client = sanityClient;
  if (!client) return null;
  return (query) => client.fetch<T>(query);
}
