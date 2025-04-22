export interface GoalTask {
  id: string;
  name: string;
  completed: boolean;
  traitId?: string; // Optional trait link
  xpValue?: number; // Optional XP value for completing the task
}

export interface Goal {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
  dueDate?: string;
  progress: number; // 0-100
  tasks: GoalTask[];
  xpValue?: number; // Optional XP value for completing the GOAL
  traitId?: string; // Optional trait link for the GOAL
}
