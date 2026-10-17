/**
 * For `@Transform(parseQueryBoolean)` on boolean query params. Not
 * `@Type(() => Boolean)`: class-transformer's coercion is `Boolean(value)`, so
 * the string "false" (any non-empty string) would become `true`.
 */
export function parseQueryBoolean({ value }: { value: unknown }): unknown {
  if (typeof value !== 'string') return value;
  return !['false', '0', ''].includes(value.toLowerCase());
}
