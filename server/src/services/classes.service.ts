export const classesService = {
  normalizeRole(role: unknown) {
    if (typeof role !== "string") {
      return "PRIMARY";
    }
    const upper = role.toUpperCase();
    if (upper === "PRIMARY" || upper === "ASSISTANT" || upper === "SUBSTITUTE") {
      return upper;
    }
    return "PRIMARY";
  },
};
