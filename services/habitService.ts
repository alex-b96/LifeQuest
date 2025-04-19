import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit } from '../models/Habit';

const HABITS_KEY = 'habits';

export const habitService = {
  async getAllAsyncStorageData() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const items = await AsyncStorage.multiGet(keys);
      
      console.log('AsyncStorage Data:');
      items.forEach(item => {
        console.log(`${item[0]}: ${item[1]}`);
      });
    } catch (error) {
      console.error('Error getting AsyncStorage items:', error);
    }
  },
  
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
      habits[idx] = { ...habits[idx], ...updated };
      await this.saveHabits(habits);
    }
  },

  async deleteHabit(habitId: string): Promise<void> {
    const habits = await this.getHabits();
    const newHabits = habits.filter(h => h.id !== habitId);
    await this.saveHabits(newHabits);
  },

  async completeHabit(habitId: string, date: string): Promise<void> {
    const habits = await this.getHabits();
    const idx = habits.findIndex(h => h.id === habitId);
    if (idx !== -1) {
      const habit = habits[idx];
      // Avoid double completion for the same day
      if (!habit.completions.includes(date)) {
        const previousLastCompleted = habit.lastCompleted; // Store previous value

        habit.completions.push(date);
        habit.completions.sort(); // Keep completions sorted for easier logic
        habit.lastCompleted = date;

        // Streak logic: check if the *previous* last completion was yesterday
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (previousLastCompleted === yesterdayStr) {
          // Completed yesterday, increment streak
          habit.streak += 1;
        } else if (habit.lastCompleted === date && habit.completions.length === 1) {
          // This is the first completion ever for this habit
          habit.streak = 1;
        } else {
          // Missed a day or first completion wasn't yesterday, reset streak to 1
          habit.streak = 1;
        }
      }
      habits[idx] = habit;
      await this.saveHabits(habits);
    }
  },

  async uncompleteHabit(habitId: string, date: string): Promise<void> {
    const habits = await this.getHabits();
    const idx = habits.findIndex(h => h.id === habitId);
    if (idx !== -1) {
      const habit = habits[idx];
      if (habit.completions.includes(date)) {
        habit.completions = habit.completions.filter(d => d !== date);
        // Recalculate lastCompleted
        habit.lastCompleted = habit.completions.length > 0 ? habit.completions[habit.completions.length - 1] : null;
        // Always recalculate streak when uncompleting for simplicity and robustness
        if (habit.completions.length === 0) {
          habit.streak = 0;
        } else {
          // Recalculate streak from completions
          let streak = 0;
          const lastCompletionDate = new Date(habit.completions[habit.completions.length - 1] + 'T00:00:00');
          let d = lastCompletionDate;

          // Iterate backwards day by day as long as completions exist
          while (habit.completions.includes(d.toISOString().split('T')[0])) { 
            streak++;
            d.setDate(d.getDate() - 1);
          }
          habit.streak = streak;
        }
      }
      habits[idx] = habit;
      await this.saveHabits(habits);
    }
  },
};
