# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - YYYY-MM-DD (Current Date)

### Added
- Defined `Trait` data model (`models/Trait.ts`) including id, name, description, experiencePoints, level, lastUpdated.
- Implemented state management for traits in `AppContext` (load, add, update, delete).
- Added `getTraits` and `saveTraits` functions to `storageService.ts` for AsyncStorage persistence.
- Built initial UI for `TraitsScreen` (`app/(tabs)/traits.tsx`) using `react-native-paper` components (`Card`, `FAB`, `Dialog`, `ProgressBar`).
- Implemented full CRUD functionality for traits (Add, Edit, Delete) via dialogs on the `TraitsScreen`.
- Added `KeyboardAvoidingView` and `ScrollView` to dialogs for better keyboard handling.
- Displayed trait level, experience points (with progress bar), and last updated timestamp on trait cards.
- Created reusable `TraitCard` component (`components/traits/TraitCard.tsx`) incorporating `react-native-paper` components and theme.
- Created reusable `HabitCard` component (`components/habits/HabitCard.tsx`) for consistent habit display.
- Created reusable `GoalCard` component (`components/goals/GoalCard.tsx`) with collapsible task list.
- Created reusable `TaskItem` component (`components/goals/TaskItem.tsx`) for displaying individual tasks within goals.

### Changed
- Updated `AppContextProps` type definitions to match implemented functions.
- Refactored `TraitsScreen` (`app/(tabs)/traits.tsx`) to use `TraitCard` and apply consistent theme-based styling using `useTheme`.
- Refactored `HabitsScreen` (`app/(tabs)/habits.tsx`) to use `HabitCard` and apply consistent theme-based styling using `useTheme`.
- Refactored `GoalsScreen` (`app/(tabs)/goals.tsx`) to use `GoalCard` and `TaskItem`, apply consistent theme-based styling using `useTheme`, and standardized dialogs.
- Standardized dialogs (Add/Edit/Delete) across Traits, Habits, and Goals screens for a consistent look and feel.
- Cleaned up redundant rendering logic and styles from Traits, Habits, and Goals screens.
- Moved goal/task actions (edit/delete) into `Menu` components within cards for a cleaner UI.
- Ensured FABs and empty state views are styled consistently according to the theme.
- Corrected argument passing for `updateGoalTask` in `GoalsScreen`.
- Corrected object structure passed to `addGoal` in `GoalsScreen` to align with context expectations.

### Current State
- Traits, Habits, and Goals screens now feature a consistent, refactored UI using reusable components and `react-native-paper`'s theming system.
- CRUD operations for Traits, Habits, Goals, and Tasks are functional via standardized dialogs.
- Trait, Habit, and Goal data is persisted locally using AsyncStorage.
- Goal cards include collapsible task lists with inline task addition.
- Need to review/verify `AppContext` logic, especially for `updateGoalTask` regarding progress calculation and immutable state updates.
- Still need to link Goals/Habits completion to update trait experience points.

## [Unreleased] - 2025-04-18

### Added
- Full CRUD support for tasks within each goal on the Goals page (add, edit, delete, mark complete/incomplete).
- Edit and delete dialogs for tasks, with modern UI using React Native Paper.
- Progress bar updates automatically when tasks are changed.
- Added `expo-updates` and `eas-cli` to dependencies for EAS Update support.

### Changed
- Improved Goals page UI to match Habits page aesthetics and usability.
- Updated task text color for better visibility in dark mode.

### Migration
- Migrated publishing workflow from deprecated `expo publish` to new EAS Update system (`expo-updates`, `eas-cli`).
- Updated instructions for publishing and project setup to follow Expo SDK 52+ best practices.

### Current State
- Goals and Habits pages are both fully functional with modern UI and local persistence.
- Project is ready for EAS Update and App Store/Play Store builds using EAS CLI.

## [Unreleased] - 2025-04-17

### Added
- Initialized project using `expo init --template blank-typescript`.
- Configured project to use Expo Router for file-based navigation.
- Installed `expo-router` and peer dependencies.
- Scaffolded project structure including directories for `app` (routes), `components`, `contexts`, `hooks`, `models`, `services`, `constants`, `assets`.
- Created placeholder files for screens (`dashboard`, `traits`, `goals`, `habits`, `onboarding`, `profile`), layouts (`app/_layout.tsx`, `app/(tabs)/_layout.tsx`, `app/(auth)/_layout.tsx`), components, context (`AppContext`), storage hook (`useStorage`), models (`User`, `Trait`), and services (`storageService`).
- Added `babel.config.js` with `expo-router/babel` plugin.
- Added basic `README.md`.
- Installed `react-native-paper` and `@react-native-async-storage/async-storage`.
- Created this `CHANGELOG.md` file.

### Changed
- Updated `tsconfig.json` to include `"jsx": "react-native"`.
- Updated `package.json` `main` entry point for Expo Router.
- Updated root layout (`app/_layout.tsx`) to use `Stack` navigator for managing `(tabs)` and `(auth)` groups and wrap app in `AppProvider` & `PaperProvider`.
- Updated `app/index.tsx` to redirect to `/dashboard`.
- Updated `Dashboard` and `Traits` screens to consume state (`user`, `traits`) from `useAppContext`.

### Removed
- Deleted the initial `App.tsx` file.

### Current State
- The application uses Expo (SDK 52) with Expo Router for navigation.
- The project structure is established with placeholder files.
- Root navigation (`Stack`) manages transitions between the main tabbed interface (`(tabs)`) and the authentication flow (`(auth)`).
- The main interface (`(tabs)`) uses a `Tabs` navigator.
- App successfully launches and navigates to the Dashboard screen.
- `Dashboard` and `Traits` screens are connected to `AppContext` but display default/empty data.
- Core application logic (data persistence, UI implementation, navigation flow between auth/tabs) needs to be built out.
