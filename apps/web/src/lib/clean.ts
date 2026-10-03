/** Removes keys whose value is an empty string, undefined, or null, so optional
 * backend fields aren't sent as "" and fail DTO validators like @IsNumberString. */
export function cleanInput<T extends Record<string, unknown>>(input: T): Partial<T> {
  const result: Partial<T> = {};
  for (const key of Object.keys(input) as (keyof T)[]) {
    const value = input[key];
    if (value === "" || value === undefined || value === null) continue;
    result[key] = value;
  }
  return result;
}
