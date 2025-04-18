import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit } from '../models/Habit';

const HABITS_KEY = 'habits';

export const habitService = {
  async getHabits(): Promise<Habit[]> {
    const json = await AsyncStorage.getItem(HABITS_KEY);
    return json ? JSON.parse(json) : [];
  },

  async saveHabits(habits: Habit[]): Promise<void> {
    await AsyncStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  },

  async addHabit(habit: Habit): Promise<void> {
    const habits = await this.getHabits();
    habits.push(habit);
    await this.saveHabits(habits);
  },

  async updateHabit(updated: Habit): Promise<void> {
    const habits = await this.getHabits();
    const idx = habits.findIndex(h => h.id === updated.id);
    if (idx !== -1) {
      habits[idx] = updated;
      await this.saveHabits(habits);
    }
  },

  async completeHabit(habitId: string, date: string): Promise<void> {
    const habits = await this.getHabits();
    const idx = habits.findIndex(h => h.id === habitId);
    if (idx !== -1) {
      const habit = habits[idx];
      // Avoid double completion for the same day
      if (!habit.completions.includes(date)) {
        habit.completions.push(date);
        habit.lastCompleted = date;
        // Streak logic (simplified: increment if yesterday or today, else reset)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        if (habit.lastCompleted === yesterdayStr || habit.streak === 0) {
          habit.streak += 1;
        } else {
          habit.streak = 1;
        }
      }
      habits[idx] = habit;
      await this.saveHabits(habits);
    }
  }
};
