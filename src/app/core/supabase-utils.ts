export function sanitizeNulls<T extends Record<string, any>>(item: T): T {
  if (!item) return item;
  const cleaned = { ...item };
  for (const key of Object.keys(cleaned)) {
    if (cleaned[key] === 'NULL') {
      cleaned[key as keyof T] = null as any;
    }
  }
  return cleaned;
}