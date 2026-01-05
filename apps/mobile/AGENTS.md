# Step Up - Mobile App

## Tech Stack

- **Framework**: Expo SDK 54 with Expo Router (file-based routing)
- **Language**: TypeScript 5.9 (strict mode)
- **React**: 19.0.1
- **State Management**: Zustand with AsyncStorage persistence
- **Navigation**: Expo Router with Stack and Tabs
- **Internationalization**: i18next with English (en) and Polish (pl)
- **Location**: expo-location for activity tracking with background support
- **Styling**: React Native StyleSheet with custom theme system

## Project Structure

```
src/
  app/              # Expo Router pages (file-based routing)
  common/           # Shared utilities, components, API clients, state
    api/            # API client classes and hooks
    components/     # Reusable UI components (app-* prefix)
    state/          # Zustand stores
  features/         # Feature-specific code (activity, profile)
```

## Key Patterns & Conventions

### File Naming

- Components: kebab-case with descriptive names (e.g., `app-button.tsx`, `activity-component.tsx`)
- Utilities: kebab-case (e.g., `utils.ts`, `validation.ts`)
- Store files: kebab-case with `-store` suffix (e.g., `user-store.ts`)

### API Client Pattern

- Base `ApiClient` class in `common/api/api-client.ts`
- Derived client classes extend `ApiClient` (e.g., `UserClient`, `ActivityClient`)
- API hooks in `api-hooks.ts` using React hooks pattern
- Authorization: API token from user store via `Authorization` header

### State Management

- Zustand stores in `common/state/`
- Persist state with AsyncStorage using Zustand persist middleware
- Store keys prefixed with app identifier (e.g., `user-store`)
- User store contains user data and progress information

### Routing

- Expo Router file-based routing in `src/app/`
- Protected routes using `Stack.Protected` with `guard` prop
- Tab navigation in `(tabs)/` directory
- Auth screens: `sign-in.tsx`, `sign-up.tsx`

### Components

- Use theme from `common/theme.ts` for consistent styling
- Component naming: `App*` for common components (e.g., `AppButton`, `AppInput`)
- Style using `StyleSheet.create()` with theme values
- Support disabled and pressed states

### Styling

- Theme object with colors, spacing, opacity, borderRadius
- ThemeComposable for typography, shadows, textShadows, borders
- Use theme values, avoid hardcoded values
- Color palette: primary (green), secondary (orange), dark/light grays

### Internationalization

- Translation files in `assets/locales/` (en.json, pl.json)
- Use `useTranslation()` hook from react-i18next
- Translation keys follow dot notation (e.g., `errors.unknown`)

### Type Safety

- API types defined in `common/api/api-definitions.ts`
- Use TypeScript interfaces for data structures
- Config values in `common/config.ts` as const
- Validation logic in `common/validation.ts`

### Activity Tracking

- Background location tracking with expo-location and expo-task-manager
- Activity managers: location, distance, speed, time
- Route data stored as latitude/longitude arrays
- Activity state managed via custom hooks (`use-activity.ts`)

## Development Guidelines

- Always use TypeScript strict mode
- Use path aliases: `@/*` for src root, `@assets/*` for assets
- Follow Expo Router conventions for file-based routing
- Use Expo Vector Icons (MaterialCommunityIcons) for icons
- Maintain consistent error handling with `ApiError` class
- Use Expo new architecture (enabled in app.json)

## Dependencies

- Key packages: expo-router, zustand, i18next, expo-location, react-native-maps
- Do not modify package.json without understanding Expo compatibility
