# Dependencies Documentation

This document explains all dependencies used in the Noise chat project and their purposes.

## Production Dependencies

### Core Framework
- **expo** (~54.0.25) - The Expo framework for React Native development
- **react** (19.1.0) - React library for building UI components
- **react-native** (0.81.5) - React Native framework for mobile development

### Expo SDK Modules
- **expo-brightness** (~14.0.3) - Control device screen brightness (US-006)
- **expo-constants** (~18.0.4) - Access to system and app constants
- **expo-keep-awake** (~14.0.1) - Prevent screen from sleeping during display mode (US-006)
- **expo-localization** (~16.0.1) - Access device locale and timezone (US-013)
- **expo-screen-orientation** (~8.0.2) - Lock screen to landscape mode (US-009)
- **expo-sensors** (~15.0.1) - Access to motion sensors (gyroscope, accelerometer) for IMU (US-004)
- **expo-status-bar** (~3.0.8) - Control status bar appearance

### Animation & Gestures
- **react-native-gesture-handler** (~2.22.0) - Touch and gesture handling for interactive UI
- **react-native-reanimated** (~3.16.3) - High-performance animations at 60fps for POV effect

> **Note on Reanimated version:** Expo SDK 54 officially supports Reanimated 3.16.x in Expo Go (managed workflow). Reanimated 4.x requires a custom development build (EAS Build). Version 3.16.3 includes all features needed for MVP: useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, worklets on UI thread, and 60fps animations. Upgrade to 4.x is planned after transitioning to custom development build (post-MVP).

### Internationalization
- **i18n-js** (^4.4.3) - Internationalization library for PL/EN support (US-013)

## Development Dependencies

### TypeScript
- **typescript** (~5.9.2) - TypeScript compiler for type safety
- **@types/react** (~19.1.0) - TypeScript type definitions for React

### Code Quality
- **eslint** (^8.57.1) - JavaScript/TypeScript linter
- **eslint-config-expo** (^10.0.0) - Expo's ESLint configuration
- **@typescript-eslint/eslint-plugin** (^8.19.1) - ESLint plugin for TypeScript
- **@typescript-eslint/parser** (^8.19.1) - TypeScript parser for ESLint

## Dependency Choices Rationale

### Why these specific versions?

1. **Expo SDK 54**: Latest stable version with best performance and new architecture support
2. **React 19**: Latest React with improved performance and concurrent features
3. **React Native 0.81**: Matches Expo SDK 54 compatibility
4. **Reanimated 3.16**: Compatible with Expo Go managed workflow. Version 4.x requires custom development build.
5. **Gesture Handler 2.22**: Latest stable with improved touch handling

### Security Considerations

All dependencies are:
- ✅ Actively maintained
- ✅ From trusted sources (Expo, React Native core)
- ✅ Regularly updated
- ✅ Well-documented
- ✅ Widely used in production apps

### Bundle Size Impact

Approximate bundle sizes:
- Core (React Native + Expo): ~2-3 MB
- Expo SDK modules: ~500 KB
- Animation libraries: ~300 KB
- i18n: ~50 KB
- Total JS bundle: ~3-4 MB (minified)

Optimization strategies:
- ✅ Use Expo's automatic code splitting
- ✅ Enable Hermes engine for faster startup
- ✅ Lazy load screens with React.lazy
- ✅ Use production builds for deployment

## MVP Requirements Mapping

| Dependency | MVP Requirement | User Story |
|------------|----------------|------------|
| expo-sensors | Motion sensor integration | US-004 |
| expo-brightness | Brightness control | US-006 |
| expo-keep-awake | Screen stay awake | US-006 |
| expo-screen-orientation | Landscape lock | US-009 |
| expo-localization | PL/EN support | US-013 |
| react-native-reanimated | POV animation effect | US-003, US-004 |
| react-native-gesture-handler | Touch interactions | US-007, US-008 |
| i18n-js | Translations | US-013 |

## Future Dependencies (Post-MVP)

Potential additions for future versions:
- **@react-native-async-storage/async-storage** - Persistent settings storage
- **expo-haptics** - Haptic feedback for tempo indicator (US-005)
- **expo-av** - Audio metronome for calibration (US-005)
- **expo-sharing** - Share generated effects (social sharing)
- **expo-analytics** - Enhanced analytics (if needed beyond basic tracking)
- **react-native-svg** - Custom graphics and icons
- **expo-updates** - Over-the-air updates

## Update Strategy

### Regular Updates (Monthly)
- Check for security updates: `npm audit`
- Update patch versions: `npm update`
- Review Expo SDK changelog

### Major Updates (Quarterly)
- Test new Expo SDK versions
- Update React Native version
- Test on real devices
- Update documentation

### Breaking Changes
- Always review CHANGELOG
- Test thoroughly before updating
- Update TypeScript definitions
- Check for API deprecations

## Dependency Audit

Run these commands regularly:

```bash
# Check for vulnerabilities
npm audit

# Check for outdated packages
npm outdated

# Update dependencies safely
npm update

# Fix vulnerabilities automatically
npm audit fix
```

## License Compliance

All dependencies use permissive licenses:
- ✅ MIT License (majority)
- ✅ BSD License (some)
- ✅ Apache 2.0 (some Expo modules)

No GPL or restrictive licenses that would affect commercial use.

---

**Last Updated**: 2025-11-24
**Next Review**: 2025-12-24
