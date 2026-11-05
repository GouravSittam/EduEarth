/**
 * Parse an optional integer from a JSON body.
 * - `undefined` → `undefined` (field not provided)
 * - `null`      → `null` (explicitly cleared)
 * - numeric     → the integer, if within bounds
 * Throws a `ValidationError` for anything else.
 */
export class ValidationError extends Error {}

export const parseOptionalInt = (
  value: unknown,
  field: string,
  { min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER } = {},
): number | null | undefined => {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;

  const parsed = typeof value === "number" ? value : Number(value);

  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    throw new ValidationError(`${field} must be an integer between ${min} and ${max}`);
  }

  return parsed;
};

export const parseOptionalBoolean = (
  value: unknown,
  field: string,
): boolean | undefined => {
  if (value === undefined) return undefined;
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  throw new ValidationError(`${field} must be a boolean`);
};
