export interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'custom';
  daysOfWeek?: number[]; // 0=Sunday, 6=Saturday
  createdAt: string;
  streak: number;
  lastCompleted: string | null;
  completions: string[]; // ISO date strings
}
