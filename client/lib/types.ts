export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    message: string;
    details?: unknown;
  };
}

export interface InstitutionSummary {
  id: string;
  name: string;
}

export interface StudentProfile {
  id: string;
  ecoPoints: number;
  level: number;
  streak: number;
  institution: InstitutionSummary | null;
  _count: {
    badges: number;
    challengeParticipations: number;
    classes: number;
    completedLessons: number;
    quizAttempts: number;
  };
}

export interface TeacherProfile {
  id: string;
  institution: InstitutionSummary | null;
  _count: {
    classes: number;
  };
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  role: string;
  isAdmin?: boolean;
  student?: StudentProfile | null;
  teacher?: TeacherProfile | null;
}
