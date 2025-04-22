import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trait } from '../models/Trait';
import { Goal } from '../models/Goal';
import { Habit } from '../models/Habit';

const USER_KEY = 'lifequest_user';
const TRAITS_KEY = 'lifequest_traits';
const GOALS_KEY = 'lifequest_goals'; 
const HABITS_KEY = 'lifequest_habits'; 

// Helper function for getting items
const getItem = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) as T : null;
  } catch (e) {
    console.error(`Failed to load data for key ${key}`, e);
    return null;
  }
};

// Helper function for setting items
const setItem = async (key: string, value: any): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error(`Failed to save data for key ${key}`, e);
  }
};

// Trait Functions
const getTraits = async (): Promise<Trait[]> => {
  const traits = await getItem<Trait[]>(TRAITS_KEY);
  return traits ?? []; 
};

const saveTraits = async (traits: Trait[]): Promise<void> => {
  await setItem(TRAITS_KEY, traits);
};

// --- Placeholder functions for User, Goals, Habits (Keep or replace with actual implementations) ---

// Example function (implement actual logic)
const saveUser = async (user: any) => {
  await setItem(USER_KEY, user);
};

const loadUser = async () => {
  return await getItem<any>(USER_KEY); 
};

// Example placeholders for Goals and Habits if needed
const getGoals = async (): Promise<Goal[]> => {
  const goals = await getItem<Goal[]>(GOALS_KEY);
  return goals ?? [];
};

const saveGoals = async (goals: Goal[]): Promise<void> => {
  await setItem(GOALS_KEY, goals);
};

const getHabits = async (): Promise<Habit[]> => {
  const habits = await getItem<Habit[]>(HABITS_KEY);
  return habits ?? [];
};

const saveHabits = async (habits: Habit[]): Promise<void> => {
  await setItem(HABITS_KEY, habits);
};

// ---

export const storageService = {
  saveUser,
  loadUser,
  getTraits,
  saveTraits,
  getGoals, 
  saveGoals, 
  getHabits, 
  saveHabits, 
  // Add other CRUD operations for traits, goals, habits as needed
  // e.g., addTrait, updateTrait, deleteTrait, etc.
};
