export const getErrorMessage = (
  error: unknown | Error,
  defaultMessage = "Something went wrong"
): string => {
  console.error(error);

  if (typeof error === "string" && error.length < 100) {
    return error;
  }

  if (error instanceof Error && error.message && error.message.length < 100) {
    return error.message;
  }

  return defaultMessage;
};
