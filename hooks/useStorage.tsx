import { useEffect } from 'react';
// import { loadUser, loadTraits } from '../services/storageService';
// import { useAppContext } from '../contexts/AppContext'; // Assuming you have useAppContext hook

/**
 * Hook to load initial data from storage when the app starts.
 */
export function useStorage() {
  // const { setUser, setTraits } = useAppContext(); // Get setters from context

  useEffect(() => {
    const loadData = async () => {
      // const storedUser = await loadUser();
      // if (storedUser) setUser(storedUser);
      // const storedTraits = await loadTraits();
      // if (storedTraits) setTraits(storedTraits);
      // Load goals, habits etc.
    };

    loadData();
  }, []); // Empty dependency array ensures this runs only once on mount
}
