export interface Goal {
  id: string;
  name: string;
  description?: string;
  traitId?: string; // Optional: link to a trait
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
  dueDate?: string;
  progress: number; // 0-100
  tasks: GoalTask[];
}

export interface GoalTask {
  id: string;
  name: string;
  completed: boolean;
}
