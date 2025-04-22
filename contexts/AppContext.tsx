import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Trait } from '../models/Trait';
import { Goal, GoalTask } from '../models/Goal';
import { Habit } from '../models/Habit';
import { storageService } from '../services/storageService';

interface AppContextProps {
  traits: Trait[];
  setTraits: (traits: Trait[]) => Promise<void>;
  addTrait: (newTrait: Omit<Trait, 'id' | 'experiencePoints' | 'level' | 'lastUpdated'>) => Promise<void>;
  updateTrait: (updatedTrait: Trait) => Promise<void>;
  deleteTrait: (traitId: string) => Promise<void>;
  addExperienceToTrait: (traitId: string, xp: number) => Promise<void>;

  goals: Goal[];
  setGoals: (goals: Goal[]) => Promise<void>;
  addGoal: (newGoalData: Omit<Goal, 'id' | 'createdAt' | 'progress' | 'tasks'>) => Promise<void>;
  updateGoal: (updatedGoal: Goal) => Promise<void>;
  deleteGoal: (goalId: string) => Promise<void>;
  updateGoalTask: (goalId: string, taskId: string, completed: boolean) => Promise<void>;

  habits: Habit[];
  setHabits: (habits: Habit[]) => Promise<void>;
  addHabit: (newHabitData: Omit<Habit, 'id' | 'createdAt' | 'streak' | 'lastCompleted' | 'completions'>) => Promise<void>;
  updateHabit: (updatedHabit: Habit) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;
  completeHabit: (habitId: string, completionDate: string) => Promise<void>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [traits, setTraitsState] = useState<Trait[]>([]);
  const [goals, setGoalsState] = useState<Goal[]>([]);
  const [habits, setHabitsState] = useState<Habit[]>([]);

  const XP_PER_LEVEL = 100;

  useEffect(() => {
    const loadData = async () => {
      const storedTraits = await storageService.getTraits();
      setTraitsState(storedTraits);
      const storedGoals = await storageService.getGoals();
      setGoalsState(storedGoals);
      const storedHabits = await storageService.getHabits();
      setHabitsState(storedHabits);
    };
    loadData();
  }, []);

  const setTraits = async (newTraits: Trait[]) => {
    await storageService.saveTraits(newTraits);
    setTraitsState(newTraits);
  };

  const addTrait = async (newTraitData: Omit<Trait, 'id' | 'experiencePoints' | 'level' | 'lastUpdated'>) => {
    const newTrait: Trait = {
      ...newTraitData,
      id: Date.now().toString(),
      experiencePoints: 0,
      level: 1,
      lastUpdated: new Date(),
    };
    const updatedTraits = [...traits, newTrait];
    await setTraits(updatedTraits);
  };

  const updateTrait = async (updatedTrait: Trait) => {
    const updatedTraits = traits.map(trait =>
      trait.id === updatedTrait.id ? { ...updatedTrait, lastUpdated: new Date() } : trait
    );
    await setTraits(updatedTraits);
  };

  const deleteTrait = async (traitId: string) => {
    const updatedTraits = traits.filter(trait => trait.id !== traitId);
    await setTraits(updatedTraits);
  };

  const addExperienceToTrait = async (traitId: string, xpToAdd: number) => {
    const traitIndex = traits.findIndex(t => t.id === traitId);
    if (traitIndex === -1) {
      console.warn(`addExperienceToTrait: Trait with id ${traitId} not found.`);
      return;
    }

    const updatedTraits = [...traits];
    const trait = { ...updatedTraits[traitIndex] };

    trait.experiencePoints += xpToAdd;
    trait.lastUpdated = new Date();

    while (trait.experiencePoints >= XP_PER_LEVEL) {
      trait.level += 1;
      trait.experiencePoints -= XP_PER_LEVEL;
      console.log(`Trait ${trait.name} leveled up to Level ${trait.level}!`);
    }

    updatedTraits[traitIndex] = trait;
    await setTraits(updatedTraits);
  };

  const setGoals = async (newGoals: Goal[]) => {
    await storageService.saveGoals(newGoals);
    setGoalsState(newGoals);
  };

  const addGoal = async (newGoalData: Omit<Goal, 'id' | 'createdAt' | 'progress' | 'tasks'>) => {
    const newGoal: Goal = {
      ...newGoalData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'active',
      progress: 0,
      tasks: [],
    };
    const updatedGoals = [...goals, newGoal];
    await setGoals(updatedGoals);
  };

  const updateGoal = async (updatedGoal: Goal) => {
    const goalIndex = goals.findIndex(g => g.id === updatedGoal.id);
    if (goalIndex === -1) return;

    const previousGoal = goals[goalIndex]; // Get previous state
    const updatedGoals = [...goals];
    updatedGoals[goalIndex] = updatedGoal;
    setGoals(updatedGoals);
    await storageService.saveGoals(updatedGoals);

    // Check if status changed to 'completed'
    if (updatedGoal.status === 'completed' && previousGoal.status !== 'completed') {
        // Check if goal has XP value and linked trait
        if (updatedGoal.xpValue && updatedGoal.traitId) {
            console.log(`Goal '${updatedGoal.name}' completed! Awarding ${updatedGoal.xpValue} XP to trait ${updatedGoal.traitId}`);
            await addExperienceToTrait(updatedGoal.traitId, updatedGoal.xpValue);
        }
    }
  };

  const deleteGoal = async (goalId: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    await setGoals(updatedGoals);
  };

  const updateGoalTask = async (goalId: string, taskId: string, completed: boolean) => {
    const goalIndex = goals.findIndex(g => g.id === goalId);
    if (goalIndex === -1) return;

    const updatedGoals = [...goals];
    const goal = { ...updatedGoals[goalIndex], tasks: [...updatedGoals[goalIndex].tasks] };

    const taskIndex = goal.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    const task = { ...goal.tasks[taskIndex] };

    const awardingXp = completed && !task.completed;
    const removingXp = !completed && task.completed;
    task.completed = completed;
    goal.tasks[taskIndex] = task;

    const completedTasks = goal.tasks.filter(t => t.completed).length;
    goal.progress = goal.tasks.length > 0 ? Math.round((completedTasks / goal.tasks.length) * 100) : 0;

    updatedGoals[goalIndex] = goal;
    await setGoals(updatedGoals);

    if (awardingXp && goal.traitId && task.xpValue && task.xpValue > 0) {
      await addExperienceToTrait(goal.traitId, task.xpValue);
    }

    if (removingXp && goal.traitId && task.xpValue && task.xpValue > 0) {
      await addExperienceToTrait(goal.traitId, -task.xpValue);
    }
  };

  const setHabits = async (newHabits: Habit[]) => {
    await storageService.saveHabits(newHabits);
    setHabitsState(newHabits);
  };

  const addHabit = async (newHabitData: Omit<Habit, 'id' | 'createdAt' | 'streak' | 'lastCompleted' | 'completions'>) => {
    const newHabit: Habit = {
      ...newHabitData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      streak: 0,
      lastCompleted: null,
      completions: [],
    };
    const updatedHabits = [...habits, newHabit];
    await setHabits(updatedHabits);
  };

  const updateHabit = async (updatedHabit: Habit) => {
    const updatedHabits = habits.map(habit =>
      habit.id === updatedHabit.id ? updatedHabit : habit
    );
    await setHabits(updatedHabits);
  };

  const deleteHabit = async (habitId: string) => {
    const updatedHabits = habits.filter(habit => habit.id !== habitId);
    await setHabits(updatedHabits);
  };

  const completeHabit = async (habitId: string, completionDate: string) => {
    const habitIndex = habits.findIndex(h => h.id === habitId);
    if (habitIndex === -1) return;

    const updatedHabits = [...habits];
    const habit = { ...updatedHabits[habitIndex] };

    if (!habit.completions.includes(completionDate)) {
      habit.completions = [...habit.completions, completionDate].sort().reverse();
      habit.lastCompleted = completionDate;
      habit.streak = habit.streak + 1;

      updatedHabits[habitIndex] = habit;
      await setHabits(updatedHabits);

      if (habit.traitId && habit.xpValue && habit.xpValue > 0) {
        await addExperienceToTrait(habit.traitId, habit.xpValue);
      }
    } else {
      console.log(`Habit ${habit.name} already completed on ${completionDate}`);
    }
  };

  return (
    <AppContext.Provider value={{
      traits, setTraits, addTrait, updateTrait, deleteTrait, addExperienceToTrait,
      goals, setGoals, addGoal, updateGoal, deleteGoal, updateGoalTask,
      habits, setHabits, addHabit, updateHabit, deleteHabit, completeHabit,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
