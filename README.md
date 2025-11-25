# Noise chat

A mobile application that displays short text messages using persistence of vision (POV) effect. Wave your phone to create readable messages in the air!

## 📱 About

Noise chat allows users to create short messages (up to 10 characters) that become visible only when waving the phone screen quickly. Using the afterimage effect (persistence of light), the app displays words in a way that creates a readable message in the air. The intuitive interface allows you to enter your chosen word and immediately launch display mode. Perfect for concerts, events, or creative visual communication at parties.

## 🚀 Technology Stack

### Frontend
- **React Native (Expo)** - Quick deployment, single codebase for iOS and Android
- **TypeScript** - Type safety and better developer experience
- **React Native Reanimated** - High-performance animations
- **React Native Gesture Handler** - Touch and gesture handling
- **expo-sensors** - IMU/motion sensor access for motion synchronization

### Features
- ✅ Offline-first - No backend required
- ✅ Motion sensor integration (IMU)
- ✅ Brightness control
- ✅ i18n support (Polish/English)
- ✅ Safety features (flicker protection, auto-off)
- ✅ Landscape orientation support
- ✅ Opt-in analytics

## 📁 Project Structure

```
noise-chat/
├── .agents/                    # Agent documentation
│   ├── MVP.md                  # MVP specification
│   └── PRD.md                  # Product Requirements Document
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── Button.tsx          # Action button component
│   │   ├── TextEditor.tsx      # Text input with validation
│   │   └── index.ts            # Component exports
│   ├── screens/                # Main app screens
│   │   ├── OnboardingScreen.tsx # Safety warnings and tutorial
│   │   ├── EditorScreen.tsx    # Text input and preview
│   │   ├── DisplayScreen.tsx   # POV text effect display
│   │   └── index.ts            # Screen exports
│   ├── services/               # Business logic and platform APIs
│   │   ├── MotionService.ts    # IMU/motion sensor management
│   │   ├── BrightnessService.ts # Screen brightness control
│   │   ├── AnalyticsService.ts # Event tracking (opt-in)
│   │   └── index.ts            # Service exports
│   ├── hooks/                  # Custom React hooks
│   │   ├── useSettings.ts      # App settings management
│   │   ├── useTextValidation.ts # Text validation logic
│   │   └── index.ts            # Hook exports
│   ├── utils/                  # Utility functions
│   │   ├── textValidation.ts   # Text validation utilities
│   │   ├── device.ts           # Device capability detection
│   │   └── index.ts            # Utility exports
│   ├── types/                  # TypeScript type definitions
│   │   └── index.ts            # Core type definitions
│   ├── constants/              # App constants and configuration
│   │   └── index.ts            # Configuration constants
│   └── i18n/                   # Internationalization
│       ├── locales/
│       │   ├── en.json         # English translations
│       │   └── pl.json         # Polish translations
│       └── index.ts            # i18n configuration
├── assets/                     # Static assets
│   ├── icon.png                # App icon
│   ├── splash-icon.png         # Splash screen
│   ├── adaptive-icon.png       # Android adaptive icon
│   └── favicon.png             # Web favicon
├── App.tsx                     # Root component
├── index.ts                    # Entry point
├── app.json                    # Expo configuration
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript configuration
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

## 🏗️ Architecture Pattern

The project follows a **Feature-based Architecture** with clear separation of concerns:

1. **Screens** - Container components for main app views
2. **Components** - Reusable, presentational UI components
3. **Services** - Platform API wrappers and business logic
4. **Hooks** - Custom React hooks for state and side effects
5. **Utils** - Pure utility functions
6. **Types** - TypeScript type definitions
7. **Constants** - Configuration and constant values
8. **i18n** - Internationalization and translations

This structure provides:
- 📦 **Modularity** - Easy to add, modify, or remove features
- 🧪 **Testability** - Clear separation makes testing straightforward
- 🔄 **Reusability** - Components and hooks can be reused across screens
- 📖 **Readability** - Clear folder structure and naming conventions
- 🚀 **Scalability** - Easy to extend as the app grows

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or newer)
- npm or yarn
- Expo CLI
- iOS Simulator (macOS) or Android Emulator

### Installation

1. Clone the repository:
```bash
git clone https://github.com/codeandlove/Noise-chat.git
cd Noise-chat
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on a platform:
```bash
# iOS (requires macOS)
npm run ios

# Android
npm run android

# Web (limited functionality)
npm run web
```

## 📝 Development

### Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS simulator/device
- `npm run web` - Run on web browser
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Keep components small and focused
- Write self-documenting code with clear naming
- Add comments for complex logic only

## 🔒 Privacy & Security

- No user accounts or authentication required
- No personal data collection
- Analytics is opt-in only
- All data stored locally on device
- Includes safety warnings for photosensitivity
- Automatic brightness restoration
- Thermal monitoring and safe mode

## 🌍 Supported Platforms

- **iOS** 15.0 or later
- **Android** 8.0 (API 26) or later
- **Screen refresh rates**: 60Hz, 90Hz, 120Hz

## 🔧 Troubleshooting

### Error: "WorkletsError: Mismatch between JavaScript part and native part"

**Cause:** Incompatible Reanimated version with Expo Go.

**Solution:**
1. Ensure `babel.config.js` exists with the Reanimated plugin
2. Check that you have `react-native-reanimated@~3.16.3` in package.json
3. Clear cache and reinstall:
```bash
rm -rf node_modules .expo
npm install
npx expo start -c
```

### Error: "Exception in HostFunction: NativeReanimated"

**Cause:** Missing Babel configuration for Reanimated.

**Solution:** Check that `babel.config.js` contains the plugin `react-native-reanimated/plugin` as the **last** item in the plugins array.

## 📄 License

See LICENSE file for details.

## 🤝 Contributing

This is a private project. For any questions or issues, please contact the development team.

## 📚 Documentation

For detailed product requirements and MVP specifications, see:
- `.agents/PRD.md` - Product Requirements Document
- `.agents/MVP.md` - MVP Specification

---

**Made with ❤️ by Code & Love**
