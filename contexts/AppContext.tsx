import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Trait } from '../models/Trait';
import { storageService } from '../services/storageService';
// import { User } from '../models/User';
// import { Trait } from '../models/Trait';

interface AppContextProps {
  // user: User | null;
  // setUser: (user: User | null) => void;
  traits: Trait[];
  setTraits: (traits: Trait[]) => void;
  addTrait: (newTrait: Omit<Trait, 'id' | 'experiencePoints' | 'level' | 'lastUpdated'>) => Promise<void>;
  updateTrait: (updatedTrait: Trait) => Promise<void>;
  deleteTrait: (traitId: string) => Promise<void>;
  // ... other state management functions
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // const [user, setUser] = useState<User | null>(null);
  const [traits, setTraitsState] = useState<Trait[]>([]);

  // Load initial data from storage
  useEffect(() => {
    const loadData = async () => {
      const storedTraits = await storageService.getTraits();
      setTraitsState(storedTraits);
      // Load user, goals, habits etc.
    };
    loadData();
  }, []);

  // Function to persist traits and update state
  const setTraits = async (newTraits: Trait[]) => {
    await storageService.saveTraits(newTraits);
    setTraitsState(newTraits);
  };

  // Function to add a new trait
  const addTrait = async (newTraitData: Omit<Trait, 'id' | 'experiencePoints' | 'level' | 'lastUpdated'>) => {
    const newTrait: Trait = {
      ...newTraitData,
      id: Date.now().toString(), // Simple unique ID generation
      experiencePoints: 0,
      level: 1, // Initialize level to 1
      lastUpdated: new Date(), // Set current date/time
    };
    const updatedTraits = [...traits, newTrait];
    await setTraits(updatedTraits);
  };

  // Function to update an existing trait
  const updateTrait = async (updatedTrait: Trait) => {
    const updatedTraits = traits.map(trait =>
      trait.id === updatedTrait.id ? { ...updatedTrait, lastUpdated: new Date() } : trait // Update lastUpdated timestamp
    );
    await setTraits(updatedTraits);
  };

  // Function to delete a trait
  const deleteTrait = async (traitId: string) => {
    const updatedTraits = traits.filter(trait => trait.id !== traitId);
    await setTraits(updatedTraits);
  };

  return (
    <AppContext.Provider value={{ /* user, setUser, */ traits, setTraits, addTrait, updateTrait, deleteTrait /* ... other state */ }}>
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
