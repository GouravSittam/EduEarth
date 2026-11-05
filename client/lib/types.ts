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
  /** Current daily streak (0 once a day has been missed). */
  streak: number;
  lastActivityDate?: string | null;
  /** 1-based position on the global eco-points leaderboard. */
  rank?: number;
  /** Recent days (YYYY-MM-DD, UTC) with a completed lesson or quiz. */
  activityDays?: string[];
  levelProgress?: {
    currentLevelPoints: number;
    nextLevelPoints: number;
  };
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

export interface LeaderboardEntry {
  rank: number;
  studentId: string;
  name: string;
  avatar: string | null;
  ecoPoints: number;
  level: number;
  institution: InstitutionSummary | null;
}

export interface Institution {
  id: string;
  name: string;
  address: string | null;
  type: "SCHOOL" | "COLLEGE" | "UNIVERSITY";
  _count?: { classes: number; students: number; teachers: number };
}

export interface InstitutionStatistics {
  overview: {
    totalClasses: number;
    totalStudents: number;
    totalTeachers: number;
    totalEcoPoints: number;
  };
  engagement: { avgEcoPointsPerStudent: number };
  topPerformers: Array<{
    id: string;
    ecoPoints: number;
    level: number;
    user: { name: string | null; avatar: string | null };
  }>;
}

export interface ClassSummary {
  id: string;
  name: string;
  subject: string;
  description: string | null;
  _count?: { students: number; teachers: number };
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
