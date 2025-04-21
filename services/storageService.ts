import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trait } from '../models/Trait';

const USER_KEY = 'lifequest_user';
const TRAITS_KEY = 'lifequest_traits';
const GOALS_KEY = 'lifequest_goals'; // Assuming you have this key defined
const HABITS_KEY = 'lifequest_habits'; // Assuming you have this key defined

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
  return traits ?? []; // Return empty array if null
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
  return await getItem<any>(USER_KEY); // Replace 'any' with User type
};

// Example placeholders for Goals and Habits if needed
const getGoals = async (): Promise<any[]> => {
  const goals = await getItem<any[]>(GOALS_KEY);
  return goals ?? [];
};

const saveGoals = async (goals: any[]): Promise<void> => {
  await setItem(GOALS_KEY, goals);
};

const getHabits = async (): Promise<any[]> => {
  const habits = await getItem<any[]>(HABITS_KEY);
  return habits ?? [];
};

const saveHabits = async (habits: any[]): Promise<void> => {
  await setItem(HABITS_KEY, habits);
};

// ---

export const storageService = {
  saveUser,
  loadUser,
  getTraits,
  saveTraits,
  getGoals, // Add if needed
  saveGoals, // Add if needed
  getHabits, // Add if needed
  saveHabits, // Add if needed
  // Add other CRUD operations for traits, goals, habits as needed
  // e.g., addTrait, updateTrait, deleteTrait, etc.
};
