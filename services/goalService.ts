import AsyncStorage from '@react-native-async-storage/async-storage';
import { Goal, GoalTask } from '../models/Goal';

const GOALS_KEY = 'goals';

export const goalService = {
  async getGoals(): Promise<Goal[]> {
    const json = await AsyncStorage.getItem(GOALS_KEY);
    return json ? JSON.parse(json) : [];
  },

  async saveGoals(goals: Goal[]): Promise<void> {
    await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(goals));
  },

  async addGoal(goal: Goal): Promise<void> {
    const goals = await this.getGoals();
    goals.push(goal);
    await this.saveGoals(goals);
  },

  async updateGoal(updated: Goal): Promise<void> {
    const goals = await this.getGoals();
    const idx = goals.findIndex(g => g.id === updated.id);
    if (idx !== -1) {
      goals[idx] = { ...goals[idx], ...updated };
      await this.saveGoals(goals);
    }
  },

  async deleteGoal(goalId: string): Promise<void> {
    const goals = await this.getGoals();
    const newGoals = goals.filter(g => g.id !== goalId);
    await this.saveGoals(newGoals);
  },

  async toggleTask(goalId: string, taskId: string): Promise<void> {
    const goals = await this.getGoals();
    const idx = goals.findIndex(g => g.id === goalId);
    if (idx !== -1) {
      const goal = goals[idx];
      const taskIdx = goal.tasks.findIndex(t => t.id === taskId);
      if (taskIdx !== -1) {
        goal.tasks[taskIdx].completed = !goal.tasks[taskIdx].completed;
        // Update progress
        const total = goal.tasks.length;
        const done = goal.tasks.filter(t => t.completed).length;
        goal.progress = total > 0 ? Math.round((done / total) * 100) : 0;
        goals[idx] = goal;
        await this.saveGoals(goals);
      }
    }
  },

  async editTask(goalId: string, taskId: string, newName: string): Promise<void> {
    const goals = await this.getGoals();
    const idx = goals.findIndex(g => g.id === goalId);
    if (idx !== -1) {
      const goal = goals[idx];
      const taskIdx = goal.tasks.findIndex(t => t.id === taskId);
      if (taskIdx !== -1) {
        goal.tasks[taskIdx].name = newName;
        goals[idx] = goal;
        await this.saveGoals(goals);
      }
    }
  },

  async deleteTask(goalId: string, taskId: string): Promise<void> {
    const goals = await this.getGoals();
    const idx = goals.findIndex(g => g.id === goalId);
    if (idx !== -1) {
      const goal = goals[idx];
      goal.tasks = goal.tasks.filter(t => t.id !== taskId);
      // Update progress
      const total = goal.tasks.length;
      const done = goal.tasks.filter(t => t.completed).length;
      goal.progress = total > 0 ? Math.round((done / total) * 100) : 0;
      goals[idx] = goal;
      await this.saveGoals(goals);
    }
  },
};
