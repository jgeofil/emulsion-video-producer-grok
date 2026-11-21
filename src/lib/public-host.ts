/** Same host guard the share-card injector uses for og:image. */
export function publicAppHost(hostHeader: string | null | undefined): string {
  const host = String(hostHeader ?? "")
    .split(",")[0]
    .trim()
    .split(":")[0]
    .toLowerCase();
  if (!host || !/^[a-z0-9.-]+$/.test(host) || !host.includes(".")) return "";
  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)) return "";
  if (
    host === "vercel.app" ||
    host.endsWith(".vercel.app") ||
    host === "vercel.com" ||
    host.endsWith(".vercel.com")
  ) {
    return "";
  }
  return host;
}

export function resolvePublicHost(hostHeader: string | null | undefined): string {
  const fromProcess =
    typeof process !== "undefined" ? process.env.VITE_PUBLIC_HOSTNAME : "";
  const fromVite = import.meta.env.VITE_PUBLIC_HOSTNAME as string | undefined;
  return publicAppHost(fromProcess || fromVite || "") || publicAppHost(hostHeader);
}
