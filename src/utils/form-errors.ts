import type { FieldError } from "react-hook-form";

export const getNestedError = (
  errors: Record<string, unknown>,
  path: string[],
): FieldError | undefined => {
  let current: unknown = errors;

  for (const key of path) {
    if (!current || typeof current !== "object") {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }

  return current as FieldError | undefined;
};

export const hasNestedError = (
  errors: Record<string, unknown>,
  path: string[],
): boolean => {
  return getNestedError(errors, path) !== undefined;
};
