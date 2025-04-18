import React, { createContext, useState, useContext, ReactNode } from 'react';
// import { User } from '../models/User';
// import { Trait } from '../models/Trait';

interface AppContextProps {
  user: any | null; // Replace 'any' with 'User' type
  setUser: (user: any | null) => void; // Replace 'any' with 'User'
  traits: any[]; // Replace 'any[]' with 'Trait[]'
  setTraits: (traits: any[]) => void; // Replace 'any[]' with 'Trait[]'
  // Add state for goals, habits etc.
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [traits, setTraits] = useState<any[]>([]);
  // Add state for goals, habits etc.

  return (
    <AppContext.Provider value={{ user, setUser, traits, setTraits /* ... other state */ }}>
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
