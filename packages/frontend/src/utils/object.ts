export function objectToQueryString<V>(object: Partial<Record<keyof unknown, V>>): string {
  return Object.entries(object)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
}

export function isObject(obj: unknown) {
  return obj !== null && typeof obj !== 'function' && typeof obj === 'object';
}
