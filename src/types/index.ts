export interface Subject {
    id: string;
    name: string;
  }
  
  export interface StudySession {
    id: string;
    subjectId: string;
    date: string; // ISO string format
    duration: number; // minutes
    content: string;
    notes: string;
  }
  
  export interface MonthlyGoal {
    id: string;
    month: string; // Format: YYYY-MM
    subjectId: string | null; // null means overall goal
    targetHours: number;
  }
  
  export interface AppState {
    subjects: Subject[];
    studySessions: StudySession[];
    monthlyGoals: MonthlyGoal[];
  }