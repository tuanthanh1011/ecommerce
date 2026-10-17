/** Message + stack of anything thrown, without assuming it is an Error. */
export function describeError(err: unknown): {
  message: string;
  stack?: string;
} {
  return err instanceof Error
    ? { message: err.message, stack: err.stack }
    : { message: String(err) };
}
