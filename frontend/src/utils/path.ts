/**
 * Prepends the Vite base path to a site-relative path for sub-path deployments.
 *
 * @example
 *   basePath('/solutions/')  →  '/solutions/'   (base = '/')
 *   basePath('/solutions/')  →  '/v2/solutions/' (base = '/v2/')
 */
export function basePath(path: string): string {
  const base = import.meta.env.BASE_URL;
  const cleanPath = path.replace(/^\//, '');

  return `${base}${cleanPath}`;
}
