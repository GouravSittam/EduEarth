export const parseBoundedPagination = (
  pageInput: unknown,
  limitInput: unknown,
  defaultLimit = 10,
  maxLimit = 50,
) => {
  const parsedPage = Number.parseInt(String(pageInput ?? "1"), 10);
  const parsedLimit = Number.parseInt(String(limitInput ?? defaultLimit), 10);

  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const limit = Number.isFinite(parsedLimit)
    ? Math.min(Math.max(parsedLimit, 1), maxLimit)
    : defaultLimit;

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};
