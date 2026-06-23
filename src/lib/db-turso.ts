import { createClient, type Client } from "@libsql/client";

export const tursoDb: Client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export function nowIso(): string {
  return new Date().toISOString();
}

export function toIsoDate(value: string | Date): string | null {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

export function addHours(isoDate: string, hours: number): string {
  const date = new Date(isoDate);
  date.setHours(date.getHours() + hours);
  return date.toISOString();
}