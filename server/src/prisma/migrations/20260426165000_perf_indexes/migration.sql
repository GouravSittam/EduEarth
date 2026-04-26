CREATE INDEX IF NOT EXISTS "idx_classes_institution_id" ON "classes" ("institutionId");
CREATE INDEX IF NOT EXISTS "idx_teachers_institution_id" ON "teachers" ("institutionId");
CREATE INDEX IF NOT EXISTS "idx_students_institution_id" ON "students" ("institutionId");

CREATE INDEX IF NOT EXISTS "idx_student_classes_class_active" ON "student_classes" ("classId", "isActive");
CREATE INDEX IF NOT EXISTS "idx_teacher_classes_class_active" ON "teacher_classes" ("classId", "isActive");

CREATE INDEX IF NOT EXISTS "idx_lesson_modules_active_order" ON "lesson_modules" ("isActive", "order");
CREATE INDEX IF NOT EXISTS "idx_lessons_module_active_order" ON "lessons" ("moduleId", "isActive", "order");
CREATE INDEX IF NOT EXISTS "idx_lesson_completions_lesson_completed_at" ON "lesson_completions" ("lessonId", "completedAt");

CREATE INDEX IF NOT EXISTS "idx_quizzes_lesson_active_created" ON "quizzes" ("lessonId", "isActive", "createdAt");
CREATE INDEX IF NOT EXISTS "idx_quiz_attempts_quiz_student_completed" ON "quiz_attempts" ("quizId", "studentId", "completedAt");
