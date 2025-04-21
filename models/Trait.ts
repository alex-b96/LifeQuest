// Example Trait model
export interface Trait {
  id: string; // Unique identifier
  name: string; // Name of the trait, e.g., "Health", "Work"
  description?: string; // Optional description
  experiencePoints: number; // Points accumulated for this trait
  level: number; // e.g., 1-10
  lastUpdated: Date;
  // Consider adding level, icon, color later
}
