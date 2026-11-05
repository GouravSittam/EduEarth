import { TeacherRole } from "@prisma/client";

export const classesService = {
  normalizeRole(role: unknown): TeacherRole {
    if (typeof role !== "string") {
      return TeacherRole.PRIMARY;
    }
    const upper = role.toUpperCase();
    if (upper in TeacherRole) {
      return TeacherRole[upper as keyof typeof TeacherRole];
    }
    return TeacherRole.PRIMARY;
  },
};
