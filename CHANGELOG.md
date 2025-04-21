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

### Changed
- Updated `AppContextProps` type definitions to match implemented functions.

### Current State
- Traits screen allows users to add, view, edit, and delete personal development traits.
- Trait data is persisted locally using AsyncStorage.
- Basic visualization of trait progress (level, XP) is in place.
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
