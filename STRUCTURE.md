# Project Structure Documentation

## Overview

This document describes the complete project structure for Noise chat, a React Native (Expo) mobile application.

## Technology Choices

### Why React Native with Expo?
- **Cross-platform**: Single codebase for iOS and Android
- **Fast development**: Hot reload, over-the-air updates
- **Rich ecosystem**: Access to native APIs through Expo SDK
- **Easy setup**: No need for Xcode or Android Studio for development
- **Well-documented**: Extensive documentation and community support

### Why TypeScript?
- **Type safety**: Catch errors at compile time
- **Better IDE support**: Autocomplete and IntelliSense
- **Maintainability**: Easier to refactor and understand code
- **Documentation**: Types serve as inline documentation

## Directory Structure

### `/src/components/`
**Purpose**: Reusable UI components

**Files**:
- `Button.tsx` - Large action button with variants (primary, secondary, danger)
- `TextEditor.tsx` - Text input with built-in validation and character counter
- `index.ts` - Barrel export for easy imports

**Guidelines**:
- Keep components small and focused on single responsibility
- Use TypeScript interfaces for props
- Style with StyleSheet for performance
- Make components reusable across screens

### `/src/screens/`
**Purpose**: Full-screen container components

**Files**:
- `OnboardingScreen.tsx` - Safety warnings and app tutorial (US-010)
- `EditorScreen.tsx` - Text input and preview interface (US-001, US-002)
- `DisplayScreen.tsx` - POV text effect display (US-003, US-004)
- `index.ts` - Barrel export

**Guidelines**:
- Screens compose multiple components
- Handle navigation and screen-level state
- Connect to services and hooks
- Implement screen-specific business logic

### `/src/services/`
**Purpose**: Platform API wrappers and business logic

**Files**:
- `MotionService.ts` - IMU/motion sensor management (US-004)
- `BrightnessService.ts` - Screen brightness control (US-006)
- `AnalyticsService.ts` - Event tracking with opt-in (US-011)

**Guidelines**:
- Services are singletons for app-wide access
- Handle permissions and error cases
- Provide clean APIs abstracting platform complexity
- Implement cleanup methods to prevent leaks

### `/src/hooks/`
**Purpose**: Custom React hooks for state and side effects

**Files**:
- `useSettings.ts` - App settings management
- `useTextValidation.ts` - Text validation logic (US-001)
- `index.ts` - Barrel export

**Guidelines**:
- Extract reusable logic from components
- Follow React hooks rules
- Return clear, documented APIs
- Handle side effects properly

### `/src/utils/`
**Purpose**: Pure utility functions

**Files**:
- `textValidation.ts` - Text validation utilities
- `device.ts` - Device capability detection

**Guidelines**:
- Functions should be pure (no side effects)
- Easy to test in isolation
- Well-documented with examples
- Type-safe with TypeScript

### `/src/types/`
**Purpose**: TypeScript type definitions

**Files**:
- `index.ts` - All type definitions

**Types defined**:
- `DisplaySettings` - Display mode configuration
- `CalibrationData` - Calibration state (US-005)
- `MotionData` - IMU sensor data
- `DisplayMode` - Display mode enum
- `TempoIndicator` - Speed feedback enum
- `AppSettings` - Global app settings
- `AnalyticsEvent` - Analytics event structure

### `/src/constants/`
**Purpose**: App-wide constants and configuration

**Files**:
- `index.ts` - All constants

**Constants defined**:
- `APP_CONFIG` - Core app limits and validation rules
- `DISPLAY_CONFIG` - Display mode settings
- `SUPPORTED_LOCALES` - Available languages
- `DEFAULT_SETTINGS` - Default app settings

### `/src/i18n/`
**Purpose**: Internationalization support

**Files**:
- `index.ts` - i18n configuration
- `locales/en.json` - English translations
- `locales/pl.json` - Polish translations

**Translation sections**:
- `app` - App metadata
- `onboarding` - Tutorial and warnings
- `editor` - Text editor interface
- `display` - Display mode UI
- `settings` - Settings screen
- `errors` - Error messages
- `help` - Help and instructions

### `/assets/`
**Purpose**: Static assets (images, fonts, icons)

**Files**:
- `icon.png` - App icon (1024x1024)
- `splash-icon.png` - Splash screen
- `adaptive-icon.png` - Android adaptive icon
- `favicon.png` - Web favicon

## Key Design Patterns

### Feature-Based Architecture
The project uses a feature-based architecture with clear separation:
1. **Presentation Layer** (Screens, Components)
2. **Business Logic Layer** (Services, Hooks)
3. **Data Layer** (Types, Constants)
4. **Infrastructure Layer** (Utils, i18n)

### Singleton Services
Services like `MotionService`, `BrightnessService`, and `AnalyticsService` are implemented as singletons to ensure:
- Single source of truth for state
- Proper cleanup and resource management
- Easy access from any component

### Custom Hooks Pattern
Custom hooks encapsulate complex logic:
- `useSettings` - Global settings management
- `useTextValidation` - Input validation and normalization

### Barrel Exports
Each directory has an `index.ts` that re-exports all modules:
```typescript
export { ComponentA } from './ComponentA';
export { ComponentB } from './ComponentB';
```

Benefits:
- Cleaner imports: `import { ComponentA } from './components'`
- Easier refactoring
- Better module organization

## MVP Requirements Mapping

The structure supports all MVP requirements from PRD.md:

- **US-001** (Text editing): `TextEditor`, `useTextValidation`, `textValidation.ts`
- **US-002** (Preview): `EditorScreen`
- **US-003** (Start display): `EditorScreen`, `DisplayScreen`
- **US-004** (IMU sync): `MotionService`, `DisplayScreen`
- **US-005** (Calibration): `DisplayScreen`, calibration types
- **US-006** (Safety): `BrightnessService`, safety constants
- **US-007** (Stop button): `DisplayScreen`, `Button`
- **US-008** (Mirror/Flip): `DisplayScreen`, display settings
- **US-009** (UI scaling): Responsive layout in all screens
- **US-010** (Onboarding): `OnboardingScreen`
- **US-011** (Analytics opt-in): `AnalyticsService`
- **US-012** (Demo fallback): `MotionService`, display modes
- **US-013** (Localization): i18n structure with PL/EN
- **US-014** (Stability): Error handling, service cleanup
- **US-015** (Edge cases): Service cleanup, state restoration
- **US-016** (No auth): No authentication code

## Development Workflow

### Adding a New Feature

1. **Define types** in `/src/types/`
2. **Add constants** in `/src/constants/`
3. **Create service** (if needed) in `/src/services/`
4. **Add translations** in `/src/i18n/locales/`
5. **Create components** in `/src/components/`
6. **Build screen** in `/src/screens/`
7. **Add hooks** (if needed) in `/src/hooks/`
8. **Test and lint** with `npm run type-check` and `npm run lint`

### Code Style Guide

1. **Naming Conventions**:
   - Components: PascalCase (`TextEditor.tsx`)
   - Hooks: camelCase with `use` prefix (`useSettings.ts`)
   - Services: PascalCase with `Service` suffix (`MotionService.ts`)
   - Utils: camelCase (`textValidation.ts`)
   - Types: PascalCase (`DisplaySettings`)
   - Constants: UPPER_SNAKE_CASE (`MAX_TEXT_LENGTH`)

2. **File Organization**:
   - One component/service/hook per file
   - Co-locate related files
   - Use barrel exports (index.ts)

3. **TypeScript**:
   - Always define prop types for components
   - Use interfaces for object types
   - Avoid `any` type
   - Use strict mode

4. **React**:
   - Use functional components
   - Use hooks for state and effects
   - Keep components pure when possible
   - Memoize expensive computations

## Testing Strategy

### Unit Tests
- **Utils**: Test all utility functions in isolation
- **Hooks**: Test custom hooks with React Testing Library
- **Services**: Mock platform APIs, test business logic

### Integration Tests
- **Components**: Test with user interactions
- **Screens**: Test navigation and data flow

### E2E Tests
- **Critical paths**: Onboarding → Editor → Display
- **Platform-specific**: Test on real devices

## Performance Considerations

1. **Lazy Loading**: Load screens on demand
2. **Memoization**: Use React.memo for expensive components
3. **Animations**: Use Reanimated for 60fps animations
4. **Bundle Size**: Use dynamic imports for large dependencies
5. **IMU Sampling**: Optimize sensor update frequency

## Security & Privacy

1. **No Data Collection**: Unless user opts in
2. **Local Storage**: All data stays on device
3. **Permissions**: Request only when needed
4. **Safe Mode**: Protect against thermal and flicker issues

## Future Enhancements

### Planned Structure Extensions

1. **`/src/navigation/`** - React Navigation setup
2. **`/src/contexts/`** - React Context providers
3. **`/src/store/`** - State management (if needed)
4. **`/src/animations/`** - Reanimated animations
5. **`/__tests__/`** - Test files
6. **`/docs/`** - Additional documentation

### Scalability Considerations

The current structure supports:
- ✅ Adding new screens
- ✅ New services and APIs
- ✅ Additional languages
- ✅ Custom themes/styling
- ✅ Complex state management
- ✅ Advanced animations
- ✅ Comprehensive testing

## Maintenance

### Regular Tasks

1. **Update dependencies** monthly
2. **Run security audits** with `npm audit`
3. **Check for deprecated APIs** in Expo SDK
4. **Monitor crash reports** in production
5. **Review analytics** for usage patterns
6. **Optimize bundle size** as features grow

### Code Quality

1. **Lint before commit**: `npm run lint`
2. **Type check**: `npm run type-check`
3. **Review PRs**: Check for architectural consistency
4. **Document changes**: Update this file when structure changes

---

**Last Updated**: 2025-11-24
**Version**: 1.0.0
