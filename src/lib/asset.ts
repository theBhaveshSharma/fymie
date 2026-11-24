/** Prefix public asset paths for GitHub Pages (`/fymie`) when built with GITHUB_PAGES=true. */
export function assetUrl(path: string): string {
  if (!path || path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  if (!base) return path;
  if (path.startsWith(base + "/") || path === base) return path;
  return path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
}
